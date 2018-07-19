const fs = require('fs');
const _ = require('underscore');
const prompt = require('prompt');

const outputData = [];
const properties = [
  {
    name: 'sorting',
    warning: 'Should match with a field in the json to sort by.'
  },
  {
    name: 'output',
    warning: 'Must be a json file.'
  }
];

// Grab files to combine from input folder
fs.readdir('./input', function(err, list) {

  console.log('Combining files: ', list.join(', '));

  // Prompt user for sorting field
  prompt.start();

  prompt.get(properties, function (err, result) {
    if (err) { return onErr(err); }
    console.log('Command-line input received:');
    console.log('  Sorting: ' + result.sorting);
    console.log('  Output File: ' + result.output);


    // Grab data from each file
    for (let file in list) {
      console.log(list[file].includes('.json'))
      // Skip any non-json files
      if (!list[file].includes('.json')) continue;
      grabData(list[file]);
    }

    // Write output data to output file
    var outputJson = sortData(outputData, result.sorting);
    fs.writeFile('./output/' + result.output, outputJson, 'utf8', function() {
      console.log('Completed data merge into ' + result.output);
      process.exit();
    });

  });

});



// Grabs data from each file
// adds data to new json object
const grabData = function(file) {
  console.log('Grabbing data from ' + file);
  const data = fs.readFileSync('./input/' + file, 'utf8');
  outputData.push(data);
}

// Sorts data by time field
const sortData = function(data, field) {
  return _.sortBy(outputData, field);
}

// Catch errors in prompt
const onErr = function(err) {
  console.log(err);
  process.exit();
}
