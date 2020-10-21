//@ts-check

const countries = [
  'Germany',
  'France',
  'Italy',
  'Australia',
  'Mexico',
  'Cuba',
  'Finland',
  'Hungary',
  'Argentina',
  'Czechoslovakia',
  'India',
  'Poland',
  'Armenia',
  'Bahamas',
  'Switzerland',
  'Bhutan',
  'Algeria',
  'Afghanistan',
  'Vietnam',
  'Romania',
  'Palestinian Territory',
  'Kenya',
  'Uganda',
  'Indonesia',
  'Chile',
  'United Kingdom',
  'Belgium',
  'Hong Kong',
  'Japan',
  'Ireland',
  'Taiwan',
  'Denmark',
  'Cambodia',
  'Sweden',
  '2013',
  'Luxembourg',
  'Colombia',
  'Senegal',
  'Lebanon',
  'Bosnia and Herzegovina',
  'Thailand',
  'Haiti',
  'Israel',
  'Jamaica',
  'Tajikistan',
  'Georgia',
  'Singapore',
  'United Arab Emirates',
  'Congo',
  'United States',
  'China',
  'South Africa',
  'Canada',
  'Iran',
  'Austria',
  'Spain',
  'Brazil',
  'Czech Republic',
  'Soviet Union',
  'Fiji',
  'Cameroon',
  'Greece',
  'Ukraine',
  'Belarus',
  'Croatia',
  'Estonia',
  'Netherlands',
  'New Zealand',
  'Peru',
  'South Korea',
  'Russia',
  'Bulgaria',
  'Egypt',
  'Iceland',
  'Norway',
  'Aruba',
  'Serbia',
  "Cote D'Ivoire",
  'Philippines',
  'Ecuador',
  'Mongolia',
  'Uruguay',
  'Turkey',
  'Ghana'
];

module.exports.findCountry = (country) => {
  return countries.find((k) => k.toLowerCase() === country.toLowerCase());
};

/**
 * Checks if its a valid date
 * @param {Date} d
 */
module.exports.checkDate = (d) => {
  // @ts-ignore
  return d instanceof Date && !isNaN(d);
};


module.exports.shallowEqual = (object1, object2) => {

  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let key of keys1) {
    if (object1[key] !== object2[key]) {
      return false;
    }
  }

  return true;
}
