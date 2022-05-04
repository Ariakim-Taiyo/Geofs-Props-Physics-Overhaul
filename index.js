if (geofs.aircraft.instance.id = 2) {
let lastTorque = 0;
let engtorquemp = 0;
let elevtorquemp = 0;
let ailtorquemp = 0;
let rudtorquemp = 0;

//basic maths to figure out what the engine torque is, then apply it.
function tqmaths() {
  engtorquemp = -(lastTorque - geofs.animation.values.rpm) * 3;
    geofs.aircraft.instance.rigidBody.applyTorqueImpulse([splitAxes(engtorquemp - elevtorquemp)[0],splitAxes(engtorquemp - ailtorquemp)[1],splitAxes(engtorquemp + rudtorquemp)[2]])
};

function getEngineTorque() {
  lastTorque = geofs.animation.values.rpm
  setTimeout(tqmaths, 200)
};

//propwash stuff
function getControlWash() {
  elevtorquemp = (geofs.animation.values.rpm / 10) * geofs.animation.values.pitch;
  ailtorquemp = (geofs.animation.values.rpm / 10) * geofs.animation.values.roll;
  rudtorquemp = (geofs.animation.values.rpm / 10) * geofs.animation.values.yaw;
}

//more complicated maths to resolve torque axes
function splitAxes(force) {
  var absangle = geofs.animation.values.heading360;
  var anglex = (absangle) * (Math.PI/180);
  var angley = (absangle - 360) * (Math.PI/180);
  var anglez = geofs.animation.values.atilt;
  fx = force * (Math.cos(anglex))
  fy = force * (Math.cos(angley))
  fz = force * (Math.sin(anglez * (Math.PI/180)))
  return [fx, fy, fz];
}

function doForces() {
  getEngineTorque()
}

//stall and ground effect stuff
function stallForces() {
  if (geofs.animation.values.aoa > 10) {
    geofs.aircraft.instance.rigidBody.applyTorqueImpulse([splitAxes(Math.random()*geofs.animation.values.aoa * 2)[0],splitAxes(Math.random()*geofs.animation.values.aoa * 2)[1],0])
  }
}

function groundEffect() {
  if (geofs.animation.values.haglFeet <= 10) {
    geofs.aircraft.instance.rigidBody.applyCentralImpulse([0,0,(-(geofs.animation.values.haglFeet) + 10) * geofs.animation.values.kias])
  }
}

setInterval(function(){
  groundEffect();
  stallForces();
  getControlWash();
  doForces();
}, 200)
}
else {
  throw("Switch to C172")
}

