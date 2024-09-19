import readline from 'readline';
import fetch from 'node-fetch';

// Function to get the word's meanings and synonyms
async function getWordMeanings(word) {
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

// Function to parse each object and extract meanings and synonyms
function parseData(data) {
  data.forEach((object) => {
    const word = object.word;
    const meanings = object.meanings.map((meaning) => {
      return {
        partOfSpeech: meaning.partOfSpeech,
        definitions: meaning.definitions.map((definition) => definition.definition)
      };
    });
    const synonyms = object.meanings.map((meaning) => meaning.definitions.map((definition) => definition.synonyms).flat());

    console.log(`Word: ${word}`);
    meanings.forEach((meaning, index) => {
      console.log(`Meaning ${index + 1}: ${meaning.partOfSpeech}`);
      console.log(`Definitions: ${meaning.definitions.join(", ")}`);
    });
    console.log(`Synonyms: ${synonyms.join(", ")}`);
    console.log("---");
  });
}

// Main function
async function main() {
  try {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('Please enter a word: ', async (word) => {
      const data = await getWordMeanings(word);
      if (data) {
        parseData(data);
      } else {
        console.log("No data found for the given word.");
      }
      rl.close();
    });
  } catch (error) {
    console.error(error);
  }
}

main();
