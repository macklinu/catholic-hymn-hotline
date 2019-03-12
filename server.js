require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const twilio = require('twilio')
const signale = require('signale')

const app = express()

const sendXml = (res, twiml) => {
  res.type('text/xml')
  res.send(twiml.toString())
}

app.use(bodyParser.urlencoded({ extended: false }))

app.post('/gather', (req, res) => {
  const digits = req.body.Digits
  const twiml = new twilio.twiml.VoiceResponse()
  if (digits) {
    signale.info(`Someone pressed: ${digits}`)
    switch (digits) {
      case '1':
        twiml.say('Taste and See')
        break
      case '2':
        twiml.say('On Eagles Wings')
        break
      default:
        twiml.say('I did not understand that option').pause()
        break
    }
  } else {
    twiml.redirect('/voice')
  }

  sendXml(res, twiml)
})

app.post('/voice', (req, res) => {
  signale.info('Receiving a call')
  const twiml = new twilio.twiml.VoiceResponse()

  twiml.say('For Taste and See, press 1. For On Eagles Wings, press 2.')

  twiml.gather({ numDigits: 1, action: '/gather' }, node => {
    node.say('For Taste and See, press 1. For On Eagles Wings, press 2.')
  })

  twiml.redirect('/voice')

  sendXml(res, twiml)
})

const port = process.env.PORT || 4000
app.listen(port, () => {
  signale.success(`Listening on port ${port}`)
})
