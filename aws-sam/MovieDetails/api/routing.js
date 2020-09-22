// @ts-check
const query = require('./queryMovie');
const helper = require('./helper');

module.exports.routes = async (event) => {
  let data;

  const userId = event.requestContext.authorizer.claims.sub;
  if (!userId) {
    return helper.payload(401, null);
  }

  const id = event && event.pathParameters && event.pathParameters.id ? event.pathParameters.id : null;

  if (id) {
    // routes with path parameters
    switch (event.resource) {
      case '/recommended/{id+}':
        data = await query.getRecommended(id);
        break;
      case '/details/{id+}':
        data = await query.getMovie(userId, id);
        break;
      case '/setrating/{id+}':
        const ratingData = JSON.parse(event.body);
        data = await query.addRating(userId, id, ratingData.rating);
        break;
      case '/addwatchlist/{id+}':
        data = await query.addWatchlist(userId, id);
        break;
      case '/removewatchlist/{id+}':
        data = await query.removeWatchlist(userId, id);
        break;
      default:
        // no route found.. return 404
        return helper.payload(404, null);
    }
  } else {
    // routes without parameters
    switch (event.resource) {
      case '/watchlist':
        data = await query.getWatchlist(userId);
        break;
      default:
        // no route found.. return 404
        return helper.payload(404, null);
    }
  }

  return helper.payload(200, JSON.stringify(data));
};
