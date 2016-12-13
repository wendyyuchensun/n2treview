// Clearer: remove comments, carriage retrun/newline,
//          and empty space/lines.

module.exports = (command) => {
 command.replace(/\/\/.*/g, '').trim();
 return command;
};
