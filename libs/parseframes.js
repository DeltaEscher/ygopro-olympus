/*jslint node : true*/
/**
 * @module {function} - YGOPro Network Message Seperator
 * @description Takes stream of YGOPro network input, slices in individual messages for further processing
 * @author Jamezs "AccessDenied" L Gladney.
 * @version 0.0.1
 * @example 
 * var framer = new Framemaker();
        socket.on('data', function listener(data) {
            var frame;
            frame = framer.input(data);
            frame.forEach(function(messageFrame){
                //process the frames.
                var task = parsePackets('CTOS', new Buffer(messageFrame));
                processIncomingTrasmission(data, socket, task);
            })
                
            }
            frame = [];
        });
 */
module.exports = function () {
    "use strict";
    var memory = new Buffer([]);

    this.input = function (buffer) {
        var x = true,
            output = [],
            recordOfBuffer,
            frame_length;
        //console.log('before', memory.length, 'bytes in memory');
        memory = Buffer.concat([memory, buffer]);
        //console.log('concated', memory.length);
        while (x === true && memory.length > 2) {
            frame_length = memory[0] + memory[1];
            //console.log('read', frame_length, '(+2) of', memory.length, 'bytes');
            if ((memory.length - 2) < frame_length) {
                //console.log('not enough');
                x = false;
            } else {
                recordOfBuffer = memory.slice(2).toJSON();
                output.push(recordOfBuffer);
                if (memory.length === (frame_length + 2)) {
                    memory = new Buffer([]);
                    x = false;
                } else {
                    memory = memory.slice((frame_length + 2));
                }
                //console.log('after', memory.length);
            }
        }
        //console.log('----',output);
        return output;
    };
    return this;
};