// Status messages
export const GOOD_STATUS_MSG_COLOR = "green";
export const BAD_STATUS_MSG_COLOR = "red";
export const BAD_WORD_MSG = "Your entry is empty or contains numbers. Please enter a valid word.";
export const BAD_DEFINITION_MSG = "Your entry is empty or contains numbers. Please enter a valid definition.";
export const WORD_EXISTS_PROMPT = "Word exists, do you want to update?";

export function FORMAT_SERVER_RESPONSE({
  error = '',
  message = '',
  word = '',
  definition = '',
  word_language = '',
  definiion_language = '',
  total = '',
  status_code = '',
  entry = ''
}) {
  return `
      ${entry ? `<p>entry: ${entry}</p>` : ''}
      <p>status code: ${status_code}</p>
      ${error ? `<p>error: ${error}</p>` : ''}
      ${message ? `<p>message: ${message}</p>` : ''}
      ${word_language ? `<p>word-language: ${word_language}</p>` : ''}
      ${word ? `<p>word: ${word}</p>` : ''}
      ${definiion_language ? `<p>definition-language: ${definiion_language}</p>` : ''}
      ${definition ? `<p>definition: ${definition}</p>` : ''}
      ${total ? `<p>total word in dictionary: ${total}</p>` : ''}
      `;
}

export function FORMAT_PARAMS(word_language, word, definition_language, definition) {
  return {
    "word": word,
    "definition": definition,
    "word-language": word_language,
    "definition-language": definition_language
  };
}
