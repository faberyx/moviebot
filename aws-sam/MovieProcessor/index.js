'use strict';
const AWS = require('aws-sdk');
const query = require('./queryMovie');
//const restAPI = require('./queryAPI');
const utils = require('./utils');
const personalizeQuery = require('./personalize');

const defaultMovieCount = 4;

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
            message: { contentType: 'PlainText', content: msg },
        },
    };
};


const elicitSlot = (sessionAttributes, intentName, slots, slotToElicit, msg) => {
    return {
        sessionAttributes,
        dialogAction: {
            'type': 'ElicitSlot',
            intentName,
            slots,
            slotToElicit,
            message: { contentType: 'PlainText', content: msg },
        },
    };
};

const confirmIntent = (sessionAttributes, intentName, slots, msg) => {
    return {
        sessionAttributes,
        dialogAction: {
            'type': 'ConfirmIntent',
            intentName,
            slots,
            message: { contentType: 'PlainText', content: msg },
        },
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
            message: { contentType: 'CustomPayload', content: msg },
        }
    };

};


// ---------------------------------------------------------
// MOVIE DETAILS -> Retrieve all the informations about a movie
// ---------------------------------------------------------
const getMovieDetail = async(intentRequest, movieId) => {

    // ---------------> We have selected a movie, we return the users with some informations about it
    // const sessionAttributes = intentRequest.sessionAttributes;
    const intent = intentRequest.currentIntent;
    const slots = intent.slots;

    console.log('-> GET MOVIE DETAILS', movieId);
    // check for error here
    const movie = await query.getMovie(movieId);
    console.log('SELECTED', movie);
    if (movie) {
        return messagePayload({}, intent.name, slots, movie);
    }
    return confirmIntent({}, slots, intent.name, 'Selected movie not found!.. please search again!');
};


// ---------------------------------------------------------
//  SEARCH ON A MOVIE BASED ON THE SLOTS CONDITIONS
// ---------------------------------------------------------
const getMovies = async(intentRequest, offset, limit) => {

    const sessionAttributes = intentRequest.sessionAttributes;
    const requestAttributes = intentRequest.requestAttributes;

    // Check if we are requesting to show a single movie detail
    if (requestAttributes && requestAttributes.movieid) {
        return getMovieDetail(intentRequest, requestAttributes.movieid);
    }

    const intent = intentRequest.currentIntent;

    // find slots in the recent intent if not found in curremt
    let slots = intent.slots;

    // get the slots from the session if we are coming from a different intent
    if (intent.name !== 'SearchMovie') {
        slots = JSON.parse(sessionAttributes.slots);
    }

    console.log('SLOTS:', slots);

    const genre = slots.Genre;
    const director = slots.Director;
    const country = slots.Country;
    const actor = slots.Actor;
    const decade = slots.Decade;
    const keyword = slots.Keyword;
    let releaseTime = slots.ReleaseTime;


    if (!genre && !decade && !keyword && !director && !actor && !country && !releaseTime) {
        // No slots found....
        console.log('-> NO SLOTS FOUND');
        const session = { ...sessionAttributes, state: 'slot_not_found' };
        return close(session, 'Failed', `Couldn't find a movie for you, you can ask the bot to search another movie for you..`);
    }
    // Validate Release date
    if (releaseTime) {
        const releaseDate = new Date(Date.parse(releaseTime));
        if (utils.checkDate(releaseDate)) {
            let to = new Date(releaseDate);
            to = new Date(to.setFullYear(to.getFullYear() + 1));
            console.log('ReleaseDate>', releaseDate, 'To', to);
            releaseTime = { from: releaseDate.toISOString(), to: to.toISOString() };
        }
        else {
            return elicitSlot(sessionAttributes, 'SearchMovie', slots, 'ReleaseTime', `I can't understand this period of time.. can you try again?`);
        }
    }

    // Validate country
    if (country) {
        if (!utils.findCountry(country)) {
            return elicitSlot(sessionAttributes, 'SearchMovie', slots, 'Country', `I can't find ${country} country.. can you try again?`);
        }
    }

    // Get the list of movie from the database
    const movies = await query.getMovieList(genre, decade, keyword, director, actor, country, releaseTime, offset, limit);

    const currentOffset = parseInt(limit, 10) + parseInt(offset, 10);
    let total = parseInt(movies.total, 10) - currentOffset;
    if (total < 0) {
        total = 0;
    }
    console.log('movies>', movies.rows);
    if (movies.rows.length > 0) {
        // create a new session containing the slots and the new state in case the user wants to search for more movie later
        const session = { ...sessionAttributes, state: 'movie_search_found', slots: JSON.stringify(slots), total, offset: currentOffset };
        console.log('session>', session);
        return messagePayload(session, 'SearchMovie', {}, movies.rows);
    }

    // No results from the database, we tell the user no movies are found
    return close({}, 'Failed', `Couldnt find a movie for you! ...Do you want to retry again?`);

};

// ------------------------------------------------------------------------- Intents -----------------------------------------------------------------------------------

// -----------------------------------------------
//  RECOMMEND MOVIE INTENT
// -----------------------------------------------
const recommendMovie = async(intentRequest) => {
    console.log(intentRequest);
};


// -----------------------------------------------
//  ASK MORE DATA INTENT
// -----------------------------------------------
const askMoreData = async(intentRequest) => {
    const sessionAttributes = intentRequest.sessionAttributes;
    const offset = sessionAttributes && sessionAttributes.offset ? parseInt(sessionAttributes.offset, 10) : 0;
    const intent = intentRequest.currentIntent;
    const slots = intent.slots;
    const limit = slots && slots.Results ? slots.Results : defaultMovieCount;

    if (limit > 40) {
        return elicitSlot(sessionAttributes, intent.name, slots, 'Results', `You can show max 40 movies per time.. please select a different amount of results..`);

    }
    // increase the session paging 
    intentRequest = { ...intentRequest, sessionAttributes: { ...intentRequest.sessionAttributes, offset } };
    // QUERY THE MOVIE AND RETURN CARD
    console.log('PAGING>', offset, limit);
    return await getMovies(intentRequest, offset, limit);
};


// -----------------------------------------------
//  SEARCH MOVIE INTENT
// -----------------------------------------------
const searchMovie = async(intentRequest) => {

    let sessionAttributes = intentRequest.sessionAttributes;
    //const intent = intentRequest.currentIntent;
    //const slots = intent.slots;

    try {
        // CHECK THE INTENT SOURCE
        if (intentRequest.invocationSource === 'FulfillmentCodeHook') {
            // set the session paging to 0 -> new search
            intentRequest = { ...intentRequest, sessionAttributes: {} };
            // QUERY THE MOVIE AND RETURN CARD
            return await getMovies(intentRequest, 0, defaultMovieCount);
        }
        console.log('-> final close');
        return close({ ...sessionAttributes, state: '' }, 'Fulfilled', `nothing to see here...`);
    }
    catch (err) {
        console.log('-> ERROR!!', err);
        return close({ ...sessionAttributes, state: '' }, 'Fulfilled', `UPS...${err.message}`);

    }
};

// ------------------------------------------------------------------------- EVENT HANDLERS -----------------------------------------------------------------------------------

// -----------------------------------------------
//  INTENT DISPATCHER
// -----------------------------------------------
const dispatch = async(intentRequest, callback) => {

    console.log('Intent Request', intentRequest);
    const intent = intentRequest.currentIntent.name;
    console.log('Intent NAME', intent);
    switch (intent) {
        case 'AskMoreData':
            const responseC = await askMoreData(intentRequest);
            callback(responseC);
            return;
        case 'SearchMovie':
            const response = await searchMovie(intentRequest);
            callback(response);
            return;
        case 'RecommendMovie':
            callback(await recommendMovie(intentRequest));
            return;
    }
    callback(close(intentRequest.sessionAttributes, 'Fulfilled', 'Well you shouldnt be here!!!'));
};

// -----------------------------------------------
//  MAIN HANDLER
// -----------------------------------------------
exports.handler = (event, context, callback) => {
    try {
        dispatch(event,
            (response) => {
                callback(null, response);
            });
    }
    catch (err) {
        callback(err);
    }
};
