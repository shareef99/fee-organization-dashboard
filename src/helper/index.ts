import { AxiosError } from "axios";

/**
 * Parses an error object and returns a readable error message.
 *
 * @param {unknown} error - The error to be parsed. It can be of any type.
 * @param {string} [defaultError="unknown-error"] - A default error message to return if no specific message is found.
 * @returns {string} A readable error message derived from the input error or the default error message.
 *
 * @example
 * // Parsing a simple string error
 * const errorMessage = parseError("An error occurred");
 * console.log(errorMessage); // Output: "An error occurred"
 *
 * @example
 * // Parsing an AxiosError with a response containing a message
 * const axiosError = {
 *   response: {
 *     data: {
 *       message: "Invalid request data",
 *     },
 *   },
 * };
 * const errorMessage = parseError(axiosError);
 * console.log(errorMessage); // Output: "Invalid request data"
 *
 * @example
 * // Parsing a generic Error object
 * const error = new Error("Something went wrong");
 * const errorMessage = parseError(error);
 * console.log(errorMessage); // Output: "Something went wrong"
 *
 * @example
 * // Parsing an unknown error with a default error message
 * const unknownError = null;
 * const errorMessage = parseError(unknownError, "Default error message");
 * console.log(errorMessage); // Output: "Default error message"
 */
export function parseError(error: unknown, defaultError?: string): string {
  if (!error) return "unknown-error";

  if (typeof error === "string") return error;

  if (error instanceof AxiosError) {
    if (error.response) {
      if (error.response.data) {
        if (error.response.data.message) {
          return error.response.data.message;
        }

        if (error.response.data.error) {
          if (typeof error.response.data.error === "string") {
            return error.response.data.error;
          }

          return error.response.data.error
            .map((e: unknown) => {
              if (
                e &&
                typeof e === "object" &&
                "message" in e &&
                typeof e.message === "string"
              ) {
                return e.message;
              }
            })
            .toString();
        }

        if (error.response.data.msg) {
          return error.response.data.msg;
        }
      }
    }
  }

  if (error instanceof Error) return error.message;

  if (
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  )
    return error.message;

  if (defaultError) return defaultError;

  return "unknown-error";
}

/**
 * Capitalizes each word in a string, replacing underscores (`_`) and hyphens (`-`) with spaces.
 *
 * @param {string} str - The string to capitalize.
 * @returns {string} The capitalized string with words separated by spaces.
 *
 * @example
 * // Capitalizing a simple string
 * const result = capitalize("hello world");
 * console.log(result); // Output: "Hello World"
 *
 * @example
 * // Capitalizing a string with underscores
 * const result = capitalize("hello_world");
 * console.log(result); // Output: "Hello World"
 *
 * @example
 * // Capitalizing a string with hyphens
 * const result = capitalize("hello-world");
 * console.log(result); // Output: "Hello World"
 *
 * @example
 * // Capitalizing a mixed string with underscores and hyphens
 * const result = capitalize("hello_world-and_universe");
 * console.log(result); // Output: "Hello World And Universe"
 *
 * @example
 * // Handling an empty string
 * const result = capitalize("");
 * console.log(result); // Output: ""
 *
 * @example
 * // Handling a string that doesn't need capitalization
 * const result = capitalize("Already Capitalized");
 * console.log(result); // Output: "Already Capitalized"
 */
export function capitalize(str: string): string {
  if (typeof str !== "string" || str.length === 0) {
    return str;
  }

  return str
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .split(" ")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

/**
 * Formats a number or a string representing a number into a localized string with specified options.
 *
 * @param {number | string | null | undefined} [n=0] - The number to format. Can also be a string representing a number, `null`, or `undefined`.
 * @param {Intl.LocalesArgument} [locale="en-US"] - The locale to use for formatting. Defaults to "en-US".
 * @param {Intl.NumberFormatOptions} [options={ minimumFractionDigits: 2, maximumFractionDigits: 2 }] - The options for number formatting, such as the number of decimal places.
 * @returns {string} A formatted number as a string.
 *
 * @example
 * // Formatting a number with default locale and options
 * const formatted = formatNumber(12345.678);
 * console.log(formatted); // Output: "12,345.68" (in "en-US" locale)
 *
 * @example
 * // Formatting a string representation of a number
 * const formatted = formatNumber("9876.543");
 * console.log(formatted); // Output: "9,876.54" (in "en-US" locale)
 *
 * @example
 * // Handling null or undefined input
 * const formatted = formatNumber(null);
 * console.log(formatted); // Output: "0"
 *
 * @example
 * // Formatting with a different locale
 * const formatted = formatNumber(12345.678, "de-DE");
 * console.log(formatted); // Output: "12.345,68" (in "de-DE" locale)
 *
 * @example
 * // Customizing formatting options
 * const formatted = formatNumber(12345.678, "en-US", { minimumFractionDigits: 1, maximumFractionDigits: 3 });
 * console.log(formatted); // Output: "12,345.678"
 */
export function formatNumber(
  n: number | string | null | undefined = 0,
  locale: Intl.LocalesArgument | undefined = "en-US",
  options: Intl.NumberFormatOptions | undefined = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }
): string {
  if (n === null || n === undefined) return "0";

  if (typeof n === "string") {
    n = parseFloat(n);
  }

  return n.toLocaleString(locale, options);
}
