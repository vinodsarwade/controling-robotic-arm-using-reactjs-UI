import { useState, useEffect } from "react";
import React from "react";
import ROSLIB from "roslib";
function Buttons() {
  const [ros, setRos] = useState(null);
  const [clickCount, setClickCount] = useState({});
  const [timeoutIds, setTimeoutIds] = useState({});

  const directionMessages = {
    EEZUP: 'EE_Z_INC',
    EEZDOWN: 'EE_Z_DEC',
    pitchUP: 'PITCH_UP',
    pitchDOWN: 'PITCH_DOWN',
    EEXUP: 'EE_X_INC',
    EEXDOWN: 'EE_X_DNC',
    EEYUP: 'EE_Y_INC',
    EEYDOWN: 'EE_Y_DNC',
    EERCCW: 'EE_ROLL_CCW',
    EERCW: 'EE_ROLL_CW',
    WCCW: 'WAIST_CCW',
    WCW: 'WAIST_CW',
    GRIPPER_OPEN: 'GRIPPER_OPEN',
    GRIPPER_CLOSE: 'GRIPPER_CLOSE',
    HOME_POSE: 'HOME_POSE',
    SLEEP_POSE: 'SLEEP_POSE',
  };

  useEffect(() => {
    const ros = new ROSLIB.Ros({
      url: "ws://10.236.76.143:9090",
    });

    ros.on('connection', function () {
      console.log('Connected to websocket server.');
      setRos(ros);
    });

    ros.on('error', function (error) {
      console.log('Error connecting to websocket server: ', error);
    });

    ros.on('close', function () {
      console.log('Connection to websocket server closed.');
    });
    return () => {
      ros.close();
    };
  }, []);

  const handleClick = (direction) => {
    console.log(`Button clicked: ${direction}`);

    const directionMessages = {
      EEZUP: 'EE_Z_INC',
      EEZDOWN: 'EE_Z_DEC',
      pitchUP: 'PITCH_UP',
      pitchDOWN: 'PITCH_DOWN',
      EEXUP: 'EE_X_INC',
      EEXDOWN: 'EE_X_DNC',
      EEYUP: 'EE_Y_INC',
      EEYDOWN: 'EE_Y_DNC',
      EERCCW: 'EE_ROLL_CCW',
      EERCW: 'EE_ROLL_CW',
      WCCW: 'WAIST_CCW',
      WCW: 'WAIST_CW',
      GRIPPER_OPEN: 'GRIPPER_OPEN',
      GRIPPER_CLOSE: 'GRIPPER_CLOSE',
      HOME_POSE: 'HOME_POSE',
      SLEEP_POSE: 'SLEEP_POSE',
    };

    if (ros) {
      const armTopic = new ROSLIB.Topic({
        ros: ros,
        name: "/wx200/commands/joy_processed",
        messageType: "interbotix_xs_msgs/ArmJoy",
      });

      let joyCmd = {
        ee_x_cmd: 0,
        ee_y_cmd: 0,
        ee_z_cmd: 0,
        ee_roll_cmd: 0,
        ee_pitch_cmd: 0,
        waist_cmd: 0,
        gripper_cmd: 0,
        pose_cmd: 0,
        speed_cmd: 0,
        speed_toggle_cmd: 0,
        gripper_pwm_cmd: 0,
        torque_cmd: 0,
      };

      const command = directionMessages[direction];

      // Stop any previous timeouts for this button
      clearTimeout(timeoutIds[direction]);

      // Increment click count for this button
      const newClickCount = { ...clickCount };
      newClickCount[direction] = (newClickCount[direction] || 0) + 1;
      setClickCount(newClickCount);

      switch (command) {
        case 'EE_Z_INC':
          joyCmd.ee_z_cmd = 5;
          break;
        case 'EE_Z_DEC':
          joyCmd.ee_z_cmd = 6;
          break;
        case 'PITCH_UP':
          joyCmd.ee_pitch_cmd = 9;
          break;
        case 'PITCH_DOWN':
          joyCmd.ee_pitch_cmd = 10;
          break;
        case 'EE_X_INC':
          joyCmd.ee_x_cmd = 1;
          break;
        case 'EE_X_DNC':
          joyCmd.ee_x_cmd = 2;
          break;
        case 'EE_Y_INC':
          joyCmd.ee_y_cmd = 3;
          break;
        case 'EE_Y_DNC':
          joyCmd.ee_y_cmd = 4;
          break;
        case 'EE_ROLL_CCW':
          joyCmd.ee_roll_cmd = 7;
          break;
        case 'EE_ROLL_CW':
          joyCmd.ee_roll_cmd = 8;
          break;
        case 'WAIST_CCW':
          joyCmd.waist_cmd = 11;
          break;
        case 'WAIST_CW':
          joyCmd.waist_cmd = 12;
          break;
        case 'GRIPPER_OPEN':
          joyCmd.gripper_cmd = 13;
          break;
        case 'GRIPPER_CLOSE':
          joyCmd.gripper_cmd = 14;
          break;
        case 'HOME_POSE':
          joyCmd.pose_cmd = 15;
          break;
        case 'SLEEP_POSE':
          joyCmd.pose_cmd = 16;
          break;
        default:
          break;
      }

      armTopic.publish(joyCmd);
      console.log(`Published command to move the arm: ${command}`);

      // Set a timeout to stop the arm after a double click (500 ms)
      const timeoutId = setTimeout(() => {
        stopArmMovement(direction);
      }, 50);

      // Store the timeoutId for this button
      const newTimeoutIds = { ...timeoutIds };
      newTimeoutIds[direction] = timeoutId;
      setTimeoutIds(newTimeoutIds);
    }
  };

  // Function to stop the arm movement
  const stopArmMovement = (direction) => {
    if (ros) {
      const armTopic = new ROSLIB.Topic({
        ros: ros,
        name: "/wx200/commands/joy_processed",
        messageType: "interbotix_xs_msgs/ArmJoy",
      });

      let joyCmd = {
        ee_x_cmd: 0,
        ee_y_cmd: 0,
        ee_z_cmd: 0,
        ee_roll_cmd: 0,
        ee_pitch_cmd: 0,
        waist_cmd: 0,
        gripper_cmd: 0,
        pose_cmd: 0,
        speed_cmd: 0,
        speed_toggle_cmd: 0,
        gripper_pwm_cmd: 0,
        torque_cmd: 0,
      };

      const command = directionMessages[direction];

      // Modify joyCmd to stop the arm movement
      switch (command) {
        case 'EE_Z_INC':
        case 'EE_Z_DEC':
        case 'PITCH_UP':
        case 'PITCH_DOWN':
        case 'EE_X_INC':
        case 'EE_X_DNC':
        case 'EE_Y_INC':
        case 'EE_Y_DNC':
        case 'EE_ROLL_CCW':
        case 'EE_ROLL_CW':
        case 'WAIST_CCW':
        case 'WAIST_CW':
          joyCmd = {
            ee_x_cmd: 0,
            ee_y_cmd: 0,
            ee_z_cmd: 0,
            ee_roll_cmd: 0,
            ee_pitch_cmd: 0,
            waist_cmd: 0,
            gripper_cmd: 0,
            pose_cmd: 0,
            speed_cmd: 0,
            speed_toggle_cmd: 0,
            gripper_pwm_cmd: 0,
            torque_cmd: 0,
          };
          break;
        default:
          break;
      }

      armTopic.publish(joyCmd);
      console.log(`Stopped arm movement: ${command}`);
    }
  };

  return (
    <div className='container'>
      <div className='top-btns'>
        <div className="btn-holder">
          <div className='top'>
            <div className="btn up-button">
              <img onClick={() => handleClick('EEZUP')} className="arrow-button" src="image/up.png" alt="up Arrow" width={70} height={50} />
              <p>UP</p>

            </div>
          </div>
          <div className='middle'>
            <div className="btn left-buttons">
              <img onClick={() => handleClick('pitchUP')} className="arrow-button" src="image/left.png" alt="left Arrow" width={70} height={50} />
              <p>PITCH UP</p>
            </div>

            <div className="btn right-buttons">
              <img onClick={() => handleClick('pitchDOWN')} className="arrow-button" src="image/right.png" alt="right Arrow" width={50} height={50} />
              <p>PITCH DOWN</p>
            </div>
          </div>
          <div className='bottom'>
            <div className="btn down-button">
              <img onClick={() => handleClick('EEZDOWN')} className="arrow-button" src="image/down.png" alt="down Arrow" width={70} height={50} />
              <p>DOWN</p>
            </div>
          </div>
        </div>

        <div className="btn-holder">
          <div className='top'>
            <div className="btn up-button">
              <img onClick={() => handleClick('EEXUP')} className="arrow-button" src="image/up.png" alt="up Arrow" width={70} height={50} />
              <p>FORWARD</p>
            </div>
          </div>
          <div className='middle'>
            <div className="btn left-buttons">
              <img onClick={() => handleClick('EEYUP')} className="arrow-button" src="image/left.png" alt="left Arrow" width={70} height={50} />
              <p>LEFT</p>
            </div>

            <div className="btn right-buttons">
              <img onClick={() => handleClick('EEYDOWN')} className="arrow-button" src="image/right.png" alt="right Arrow" width={50} height={50} />
              <p>RIGHT</p>
            </div>
          </div>
          <div className='bottom'>
            <div className="btn down-button">
              <img onClick={() => handleClick('EEXDOWN')} className="arrow-button" src="image/down.png" alt="down Arrow" width={70} height={50} />
              <p>BACKWARD</p>
            </div>
          </div>
        </div>

        <div className="btn-holder">
          <div className='top'>
            <div className="btn up-button">
              <img onClick={() => handleClick('EERCCW')} className="arrow-button" src="image/up.png" alt="up Arrow" width={70} height={50} />
              <p>ROLL ACW</p>
            </div>
          </div>
          <div className='middle'>
            <div className="btn left-buttons">
              <img onClick={() => handleClick('WCCW')} className="arrow-button" src="image/left.png" alt="left Arrow" width={70} height={50} />
              <p>WAIST ACW</p>
            </div>

            <div className="btn right-buttons">
              <img onClick={() => handleClick('WCW')} className="arrow-button" src="image/right.png" alt="right Arrow" width={50} height={50} />
              <p>WAIST CW</p>
            </div>
          </div>
          <div className='bottom'>
            <div className="btn down-button">
              <img onClick={() => handleClick('EERCW')} className="arrow-button" src="image/down.png" alt="down Arrow" width={70} height={50} />
              <p>ROLL CW</p>
            </div>
          </div>
        </div>
      </div>
      <div className='bottom-btns'>
        <div className='gripper-buttons'>
          <button className='btn btn-left' onClick={() => handleClick('GRIPPER_OPEN')}>GRIPPER_OPEN</button>
          <button className='btn btn-right' onClick={() => handleClick('GRIPPER_CLOSE')}>GRIPPER_CLOSE</button>
        </div>
        <div className="gripper-buttons">
          <button className='btn btn-left' onClick={() => handleClick('HOME_POSE')} >HOME_POSE</button>
          <button className='btn btn-right' onClick={() => handleClick('SLEEP_POSE')}>SLEEP_POSE</button>
        </div>
      </div>
    </div>
  );
}
export default Buttons;