//@ts-check
const mysql = require("mysql2");
const axios = require("axios");
const csv = require("async-csv");
const fs = require("fs").promises;
const cliProgress = require("cli-progress");

const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

const connection = mysql.createConnection({
  host: "moviedb.c3tgw2putqdy.us-east-1.rds.amazonaws.com",
  user: "movieadmin",
  database: "moviesdb",
  password: "4IMJsW8jF2p0maOhOQLN",
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const insertData = async (id) => {
  try {
    const data = [];
    const movie = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}?api_key=adfcb22b23867f298e2c032ea4801456`
    );
    // id|title|genre|img|release|vote|country|countryiso|overview|tagline|cast|director|recommended|keywords
    if (movie && movie.data) {
      data.push(movie.data.popularity, movie.data.vote_average, id);
    }
    if (movie && movie.data) {
      let genre = "";
      for (let k = 0; k < movie.data.genres.length && k < 6; k++) {
        const gnr = movie.data.genres[k];
        genre = `${genre}${gnr.name}|`;
      }

      let country = "";
      let countryiso = "";
      for (
        let k = 0;
        k < movie.data.production_countries.length && k < 2;
        k++
      ) {
        const cntr = movie.data.production_countries[k];
        country =
          cntr.name === "United States of America"
            ? "United States"
            : cntr.name;
        countryiso = cntr.iso_3166_1;
      }

      data.push(
        id,
        movie.data.title,
        movie.data.original_title,
        genre.replace(/\|$/, ""),
        movie.data.poster_path,
        movie.data.release_date,
        movie.data.vote_average,
        movie.data.popularity,
        country,
        countryiso,
        movie.data.overview,
        movie.data.tagline
      );
    }
    const credits = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}/credits?api_key=adfcb22b23867f298e2c032ea4801456`
    );

    let cast = "";
    let director = "";
    if (credits && credits.data) {
      for (let k = 0; k < credits.data.cast.length && k < 6; k++) {
        const cst = credits.data.cast[k];
        cast = `${cast}${cst.name}|`;
      }

      for (let k = 0; k < credits.data.crew.length; k++) {
        const crew = credits.data.crew[k];
        if (crew.job === "Director") {
          director = `${director}${crew.name}|`;
        }
      }
    }
    data.push(cast.replace(/\|$/, ""), director.replace(/\|$/, ""));

    const recommendations = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=adfcb22b23867f298e2c032ea4801456`
    );
    let recommended = "";
    if (recommendations && recommendations.data) {
      for (let k = 0; k < recommendations.data.results.length && k < 10; k++) {
        const recm = recommendations.data.results[k];
        recommended = `${recommended}${recm.id}|`;
      }
    }
    data.push(recommended.replace(/\|$/, ""));

    const keywords = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}/keywords?api_key=adfcb22b23867f298e2c032ea4801456`
    );
    let keyw = "";
    if (keywords && keywords.data) {
      for (let k = 0; k < keywords.data.keywords.length && k < 10; k++) {
        const wk = keywords.data.keywords[k];
        keyw = `${keyw}${wk.name}|`;
      }
    }
    data.push(keyw.replace(/\|$/, ""));

    const insert = new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO movies (`id`,`title`,`originalTitle`,`genre`,`img`,`release`,`vote`, `popularity`, `country`,`countryiso`,`overview`,`tagline`,`cast`,`director`,`recommended`,`keywords`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?);",
        data,
        (err, rows) => {
          if (err) {
            console.log("ERROR>", err);
            reject(err);
            return;
          }
          resolve(rows);
        }
      );
    });

    const update = new Promise((resolve, reject) => {
      connection.query(
        "UPDATE movies SET genre=? WHERE id=?;",
        data,
        (err, rows) => {
          if (err) {
            console.log("ERROR>", err);
            reject(err);
            return;
          }
          resolve(rows);
        }
      );
    });

    if (data.length > 0) {
      const k = await update;
      if (k.affectedRows !== 1) {
        console.log(k.affectedRows);
      }
    }
  } catch (err) {
    console.error("ERROR>>", id);
  }
};

const updateData = async (data) => {
  const update = new Promise((resolve, reject) => {
    connection.query(
      "UPDATE movies SET certification=? WHERE id=?;",
      data,
      (err, rows) => {
        if (err) {
          console.log("ERROR>", err);
          reject(err);
          return;
        }
        resolve(rows);
      }
    );
  });

  if (data.length > 0) {
    const k = await update;
    if (k.affectedRows !== 1) {
      console.log(k.affectedRows);
    }
  }
};

/**
 * @param {any} id
 */
const importRatings = async (id) => {
  try {
    const data = [];
    // @ts-ignore
    const movie = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}?api_key=adfcb22b23867f298e2c032ea4801456`
    );
    // id|title|genre|img|release|vote|country|countryiso|overview|tagline|cast|director|recommended|keywords
    if (movie && movie.data) {
      data.push(
        id,
        movie.data.vote_average,
        movie.data.vote_count,
        movie.data.popularity
      );

      const select = new Promise((resolve, reject) => {
        connection.query(
          "INSERT INTO movie_rating (`id`, `vote_average`, `vote_count`, `popularity`)  VALUES (?,?,?,?);",
          data,
          (err, rows) => {
            if (err) {
              console.log("ERROR>", err);
              reject(err);
              return;
            }
            resolve(rows);
          }
        );
      });
      return await select;
    }
  } catch (err) {
    console.log("ERROR", err.message);
  }
  console.log("ERROR", id);
};

const selectData = async () => {
  const select = new Promise((resolve, reject) => {
    connection.query("select * from movies ", (err, rows) => {
      if (err) {
        console.log("ERROR>", err);
        reject(err);
        return;
      }
      resolve(rows);
    });
  });

  return await select;
};

const selectMovie = async (id) => {
  const select = new Promise((resolve, reject) => {
    connection.query("select * from movies where id = ?", id, (err, rows) => {
      if (err) {
        console.log("ERROR>", err);
        reject(err);
        return;
      }
      resolve(rows);
    });
  });

  return await select;
};

const deleteMovie = async () => {
  const select = new Promise((resolve, reject) => {
    connection.query("delete from movies ", (err, rows) => {
      if (err) {
        console.log("ERROR>", err);
        reject(err);
        return;
      }
      resolve(rows);
    });
  });

  return await select;
};

const getCertification = async (id) => {
  // @ts-ignore
  const certification = await axios.get(
    `https://api.themoviedb.org/3/movie/${id}/release_dates?api_key=adfcb22b23867f298e2c032ea4801456`
  );

  if (certification && certification.data) {
    try {
      const kk = certification.data.results
        .find((l) => l.iso_3166_1 === "US")
        .release_dates.find((t) => t.certification);

      return kk.certification;
    } catch (err) {
      console.log("ERROR_CERT> " + id);
    }
  }
  return null;
};

(async function () {
  const movies = await selectData();

  bar1.start(movies.length, 0);

  for (let i = 0; i < movies.length; i++) {
    const movie = movies[i];
    bar1.update(i);

    await importRatings(movie.id);

    await sleep(15);
  }

  //const movie = await selectMovie(143634);
  //console.log(movie);
  connection.end();
  bar1.stop();
})();
