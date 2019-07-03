const PatchBay = require('./src/pb-live.js')
const HydraSynth = require('hydra-synth')
const Editor = require('./src/editor.js')
const loop = require('raf-loop')
const P5  = require('./src/p5-wrapper.js')
const Gallery  = require('./src/gallery.js')
const Menu = require('./src/menu.js')
const LiveCodeLabCore = require('../livecodelab/src/coffee/core/livecodelab-core.coffee')
const ProgramLoader = require('../livecodelab/src/coffee/programs/program-loader.coffee')
const Canvas = require('../livecodelab/src/coffee/ui/canvas.coffee')
const EventEmitter = require('../livecodelab/src/coffee/core/event-emitter')
const Pulse           = require('../livecodelab/src/js/pulse')
const WebAudioAPI     = require('../livecodelab/src/coffee/sound/webAudioApi')
const lodash = require('lodash')
const $ = require('jquery')

lodash.extend(window, lodash)

function init () {
  // console.log("INIT", LiveCodeLabCore)
  window.pb = pb
  window.P5 = P5
  
  var lcanvas = new Canvas(document.getElementById('lc'))
  var lbackgroundDiv = document.getElementById('livecodelab-backgroundDiv')
  var leventRouter = new EventEmitter()
  
  window.lc = liveCodeLabCore = new LiveCodeLabCore(
    lcanvas,
    lbackgroundDiv,
    leventRouter,
    new Pulse(),
    new WebAudioAPI()
  )

  programLoader = new ProgramLoader(
    leventRouter,
    {},
    liveCodeLabCore
  )

  
  var canvas = document.getElementById('hydra-canvas')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  canvas.style.width = '100%'
  canvas.style.height = '100%'


  
  var pb = new PatchBay()
  var hydra = new HydraSynth({ pb: pb, canvas: canvas, autoLoop: false })
  var editor = new Editor()
  var menu = new Menu({ editor: editor, hydra: hydra})

  var initCode = `
window.a = a
a.show()
a.setSmooth(0.9)

s0.init({ src: document.getElementById('lc'), dynamic: false })
s1.initCam(1)
s2.initCam(2)

lc.updateCode(\`
noFill
stroke white
box
\`)


src(s0).out(o0)

`
  editor.cm.setValue(initCode)
  // editor.evalAll()
  // // get initial code to fill gallery
  var sketches = new Gallery(function(code, sketchFromURL) {
    // editor.saveSketch = (code) => {
    //   sketches.saveSketch(code)
    // }
    // editor.shareSketch = menu.shareSketch.bind(menu)
    // if a sketch was found based on the URL parameters, dont show intro window
    // if(sketchFromURL) {
    menu.closeModal()
    // } else {
    //   menu.openModal()
    // }
  })
  menu.sketches = sketches

  // define extra functions (eventually should be added to hydra-synth?)

  // hush clears what you see on the screen
  window.hush = () => {
    solid().out()
    solid().out(o1)
    solid().out(o2)
    solid().out(o3)
    render(o0)
  }


  pb.init(hydra.captureStream, {
    server: window.location.origin,
    room: 'iclc'
  })

  var engine = loop(function(dt) {
    hydra.tick(dt)
  }).start()

}

window.onload = init
