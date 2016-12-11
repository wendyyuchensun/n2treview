// Clear module: remove comments, carriage retrun/newline,
//               and empty space/lines.

module.exports (command) => {
 item.replace(/\/\/.*/g, '').trim();
 return command;
};
