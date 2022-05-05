if (geofs.aircraft.instance.id === "21" || geofs.aircraft.instance.id === "2" || geofs.aircraft.instance.id === "2808")  {
let lastTorque = 0;
let engtorquemp = 0;
let elevtorquemp = 0;
let ailtorquemp = 0;
let rudtorquemp = 0;

//basic maths to figure out what the engine torque is, then apply it.
function tqmaths() {
  engtorquemp = -(lastTorque - geofs.animation.values.rpm) * 6;
    geofs.aircraft.instance.rigidBody.applyTorqueImpulse([splitAxes(engtorquemp - ailtorquemp)[0] + splitAxesOffset(elevtorquemp)[0],splitAxes(engtorquemp - ailtorquemp)[1] + splitAxesOffset(elevtorquemp)[1],splitAxes(engtorquemp - ailtorquemp)[2] + splitAxesOffset(elevtorquemp)[2]])
};

function getEngineTorque() {
  lastTorque = geofs.animation.values.rpm
  setTimeout(tqmaths, 100)
};

//propwash stuff
function getControlWash() {
  elevtorquemp = (geofs.animation.values.rpm / 10) * geofs.animation.values.pitch;
  ailtorquemp = (geofs.animation.values.rpm / 10) * geofs.animation.values.roll;
  rudtorquemp = (geofs.animation.values.rpm / 10) * geofs.animation.values.yaw;
}

//more complicated maths to resolve torque axes
  //𝐹𝑠=|𝐹⃗ |cos(𝜃𝑠,𝐹)
function splitAxes(force) {
  var angle = geofs.animation.values.heading360 * (Math.PI/180)
  if (geofs.animation.values.atilt <= 0) {
  var anglez = geofs.animation.values.atilt - 45
  }
  else {
    var anglez = Math.abs(Math.abs(geofs.animation.values.atilt + 45) - 360)
  }
  
  fx = force * (Math.sin(angle))
  fy = force * (Math.cos(angle))
  fz = force * Math.cos(anglez)
  return [fx, fy, fz];
}
  
function splitAxesOffset(force) {
  var angle = (geofs.animation.values.heading360 - 90 % 360) * (Math.PI/180)
  if (geofs.animation.values.atilt <= 0) {
  var anglez = geofs.animation.values.atilt - 45
  }
  else {
    var anglez = Math.abs(Math.abs(geofs.animation.values.atilt + 45) - 360)
  }
  
  fx = force * (Math.sin(angle))
  fy = force * (Math.cos(angle))
  fz = force * Math.cos(anglez)
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

interval = setInterval(function(){
  groundEffect();
  stallForces();
  getControlWash();
  doForces();
}, 100)
}
else {
  throw("Switch to a compatible plane")
}
