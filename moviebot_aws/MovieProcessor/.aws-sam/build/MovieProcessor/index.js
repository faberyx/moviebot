// @ts-check
const query = require('./queryMovie');
const restAPI = require('./queryAPI');
const utils = require('./utils');
//const personalizeQuery = require('./personalize');

const defaultMovieCount = 12;

//--- Helpers:  Build responses which match the structure of the necessary dialog actions
//--- ConfirmationStatus None, Confirmed, or Denied (intent confirmation, if configured)
//--- DialogActionType licitIntent, ElicitSlot, ConfirmIntent, Delegate, or Close

//TYPE: -> Close, ConfirmIntent, Delegate, DialogAction, ElicitIntent, ElicitSlot

// Display a card with multiple choices
const cardDelegate = (sessionAttributes, intentName, slots, content, genericAttachments) => {
  return {
    sessionAttributes,
    dialogAction: {
      type: 'ConfirmIntent',
      intentName,
      slots: slots,
      message: { contentType: 'PlainText', content },
      responseCard: {
        version: 1,
        contentType: 'application/vnd.amazonaws.card.generic',
        genericAttachments
      }
    }
  };
};

// Close dialog with the customer -  fulfillmentState -> Failed or Fulfilled
const close = (sessionAttributes, fulfillmentState, msg) => {
  return {
    sessionAttributes,
    dialogAction: {
      type: 'Close',
      fulfillmentState,
      message: { contentType: 'PlainText', content: msg }
    }
  };
};

const elicitSlot = (sessionAttributes, intentName, slots, slotToElicit, msg) => {
  return {
    sessionAttributes,
    dialogAction: {
      type: 'ElicitSlot',
      intentName,
      slots,
      slotToElicit,
      message: { contentType: 'PlainText', content: msg }
    }
  };
};

const confirmIntent = (sessionAttributes, intentName, slots, msg) => {
  return {
    sessionAttributes,
    dialogAction: {
      type: 'ConfirmIntent',
      intentName,
      slots,
      message: { contentType: 'PlainText', content: msg }
    }
  };
};

const delegate = (sessionAttributes, slots) => {
  return {
    sessionAttributes,
    dialogAction: {
      type: 'Delegate',
      slots: slots
    }
  };
};

const messagePayload = (sessionAttributes, intentName, slots, payload, type) => {
  const msg = JSON.stringify(payload);
  return {
    sessionAttributes,
    dialogAction: {
      type: type || 'ConfirmIntent',
      intentName,
      slots,
      message: { contentType: 'CustomPayload', content: msg }
    }
  };
};

const spellCheckMessage = async (intentRequest) => {
  const sessionAttributes = intentRequest.sessionAttributes;
  const userText = intentRequest.inputTranscript;
  const intent = intentRequest.currentIntent;

  const spell = await restAPI.getSpellCheck(userText);

  console.log('SPELL CHECK ->', spell);

  // Check if there was an error of spelling in the message,
  // If there might be a corrections show the suggestion message
  if (spell.isSpellChecked) {
    const session = { ...sessionAttributes, state: 'spell_check', spellcheck: spell.text };
    return confirmIntent(session, intent.name, {}, ` I didn't really understand ${intentRequest.inputTranscript}...`);
  }
  return null;
};

// ---------------------------------------------------------
//  SEARCH ON A MOVIE BASED ON THE SLOTS CONDITIONS
// ---------------------------------------------------------
const getMovies = async (intentRequest, offset, limit) => {
  const sessionAttributes = intentRequest.sessionAttributes;
  // const requestAttributes = intentRequest.requestAttributes;
  const intent = intentRequest.currentIntent;
  const state = sessionAttributes ? sessionAttributes.state : undefined;
  // find slots in the recent intent if not found in curremt
  let slots = intent.slots;

  // check if we have a previous search.. if slots are identincal it means lex couldnt find any new slot in the text ->
  if (state && (state === 'movie_search_done' || state === 'movie_search_more')) {
    // get the slots saved in the session from previouse searches
    const sessionSlots = JSON.parse(sessionAttributes.slots);
    // if slots are the same as before it means nothing was found
    if (utils.shallowEqual(slots, sessionSlots)) {
      // Keep the same session and try with another search
      return confirmIntent(sessionAttributes, intent.name, slots, `no_movie_found`);
    }
  }

  // just get the slots from the session if we are coming from a movie_search_more pagination
  if (state === 'movie_pagination') {
    slots = JSON.parse(sessionAttributes.slots);
  }

  console.log('SLOTS:', slots);

  const genre = slots.Genre;
  const director = slots.Director;
  const country = slots.Country;
  const cast = slots.Actor;
  const decade = slots.Decade;
  const keyword = slots.Keyword;
  const year = slots.Year;
  const certification = slots.Certification;
  let releaseTime = slots.ReleaseTime;

  if (!genre && !decade && !keyword && !director && !cast && !country && !releaseTime && !year) {
    // No slots found.... might be an error or a spelling error in a message
    const spellCheck = await spellCheckMessage(intentRequest);
    if (spellCheck) {
      return spellCheck;
    }
    // not a spelling error so.. nothing found for this message!
    console.log('-> NO SLOTS FOUND');
    const session = { ...sessionAttributes, state: '' };
    return close(session, 'Failed', `Couldn't understand what you said.. 😌 maybe you can try a different search 🎥 `);
  }

  // Validate Release date, return an error if it is an invalid date
  if (releaseTime) {
    const releaseDate = new Date(Date.parse(releaseTime));
    if (utils.checkDate(releaseDate)) {
      let to = new Date(releaseDate);
      to = new Date(to.setFullYear(to.getFullYear() + 1));
      console.log('ReleaseDate>', releaseDate, 'To', to);
      releaseTime = { from: releaseDate.toISOString(), to: to.toISOString() };
    } else {
      return elicitSlot(sessionAttributes, 'SearchMovie', slots, 'ReleaseTime', `I can't understand this period of time ⏱.. can you try again?`);
    }
  }

  // Validate country, return an error if it is an unknown country
  if (country) {
    if (!utils.findCountry(country)) {
      return elicitSlot(sessionAttributes, 'SearchMovie', slots, 'Country', `I can't find ${country} country  🏴‍☠️.. can you try again?`);
    }
  }

  // calculate current pagination offset
  const currentOffset = parseInt(limit, 10) + parseInt(offset, 10);

  // Get the list of movie from the database
  const movies = await query.getMovieList(genre, decade, keyword, director, cast, country, releaseTime, year, certification, offset, limit);
  if (movies.rows.length > 0) {
    // we found some movies! return the list to frontend
    return returnMovies(movies, sessionAttributes, slots, currentOffset);
  }

  // no movies found form db.. try to check if the message was splled correctly
  const spellCheck = await spellCheckMessage(intentRequest);
  if (spellCheck) {
    return spellCheck;
  }

  // Nothing found and the sentence is correct, try to find the movie based on the message sent from the user
  // Search through all movie possible keywords
  if (intentRequest.inputTranscript) {
    // Nothing found we try a global search with the content of the message
    const allmovies = await query.getSearchGlobal(intentRequest.inputTranscript, offset, limit);
    if (allmovies.rows.length > 0) {
      return returnMovies(movies, sessionAttributes, slots, currentOffset);
    }
  }

  return close({}, 'Failed', `Couldnt find a movie for you 🎥! ...Do you want try a different search? 🚀`);
};

const returnMovies = (movies, sessionAttributes, slots, currentOffset) => {
  let total = parseInt(movies.total, 10) - currentOffset;
  if (total < 0) {
    total = 0;
  }
  // create a new session containing the slots and the new state in case the user wants to search for more movie later
  const session = { ...sessionAttributes, state: total < defaultMovieCount ? 'movie_search_done' : 'movie_search_more', slots: JSON.stringify(slots), total, offset: currentOffset };
  return messagePayload(session, 'SearchMovie', slots, movies.rows);
};

// ------------------------------------------------------------------------- Intents -----------------------------------------------------------------------------------

// -----------------------------------------------
//  ASK MORE DATA INTENT
// -----------------------------------------------
const askMoreData = async (intentRequest) => {
  const sessionAttributes = intentRequest.sessionAttributes;
  const offset = sessionAttributes && sessionAttributes.offset ? parseInt(sessionAttributes.offset, 10) : 0;
  const intent = intentRequest.currentIntent;
  const slots = intent.slots;
  const limit = slots && slots.Results ? slots.Results : defaultMovieCount;

  if (limit > 30) {
    return elicitSlot(sessionAttributes, intent.name, slots, 'Results', `You can show max 30 movies per time.. please select a different amount of results..`);
  }
  // increase the session paging
  intentRequest = { ...intentRequest, sessionAttributes: { ...intentRequest.sessionAttributes, offset, state: 'movie_pagination' } };
  // QUERY THE MOVIE AND RETURN CARD
  console.log('PAGING>', offset, limit);
  return await getMovies(intentRequest, offset, limit);
};

// -----------------------------------------------
//  FALLBACK INTENT
// -----------------------------------------------
const fallback = async (intentRequest) => {
  const sessionAttributes = intentRequest.sessionAttributes;

  if (intentRequest.inputTranscript) {
    // Nothing found we try a global search with the content of the message
    const allmovies = await query.getSearchGlobal(intentRequest.inputTranscript, 0, 4);
    if (allmovies.rows.length > 0) {
      return returnMovies(allmovies, sessionAttributes, {}, 4);
    }
  }
  // No results from the database, we tell the user no movies are found and check for spell errors
  const spellCheck = await spellCheckMessage(intentRequest);
  if (spellCheck) {
    return spellCheck;
  }

  return close({}, 'Failed', `Couldnt find a movie for you!  ☹️ ...Do you want to retry again? 🙄`);
};

// -----------------------------------------------
//  SEARCH MOVIE INTENT
// -----------------------------------------------
const searchMovie = async (intentRequest) => {
  let sessionAttributes = intentRequest.sessionAttributes;
  //const intent = intentRequest.currentIntent;
  //const slots = intent.slots;

  try {
    // CHECK THE INTENT SOURCE
    if (intentRequest.invocationSource === 'FulfillmentCodeHook') {
      return await getMovies(intentRequest, 0, defaultMovieCount);
    }
    return close({ ...sessionAttributes, state: '' }, 'Fulfilled', `I think I had an error somewhere..💀. You shouldn't really be here 🤨`);
  } catch (err) {
    console.log('-> ERROR!!', err);
    return close({ ...sessionAttributes, state: '' }, 'Fulfilled', `UPS 😬 this looks like an error...${err.message} 🙄`);
  }
};

// ------------------------------------------------------------------------- EVENT HANDLERS -----------------------------------------------------------------------------------

// -----------------------------------------------
//  INTENT DISPATCHER
// -----------------------------------------------
const dispatch = async (intentRequest, callback) => {
  console.log('Intent Request', intentRequest);

  const intent = intentRequest.currentIntent.name;

  switch (intent) {
    case 'AskMoreData':
      const responseC = await askMoreData(intentRequest);
      callback(responseC);
      return;
    case 'SearchMovie':
      const response = await searchMovie(intentRequest);
      callback(response);
      return;
    case 'Fallback':
      const responseF = await fallback(intentRequest);
      callback(responseF);
      return;
    default:
      callback(close(intentRequest.sessionAttributes, 'Fulfilled', 'Well you shouldnt be here.. intent not found!!!'));
  }
};

// -----------------------------------------------
//  MAIN HANDLER
// -----------------------------------------------
exports.handler = (event, context, callback) => {
  try {
    dispatch(event, (response) => {
      callback(null, response);
    });
  } catch (err) {
    callback(err);
  }
};
