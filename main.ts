function EstáEncendidoRiego () {
    return pins.digitalReadPin(DigitalPin.P16)
}
function MostrarNivelAgua () {
    if (NivelDeposito < AlarmaNivelAgua) {
        if (EstáEncendidoRiego() == 1) {
            ApagarRiego()
        }
        basic.showLeds(`
            # . . . #
            # . . . #
            # . . . #
            # . . . #
            # # # # #
            `)
    } else if (NivelDeposito < 1.25 * AlarmaNivelAgua) {
        basic.showLeds(`
            # . . . #
            # . . . #
            # . . . #
            # # # # #
            # # # # #
            `)
    } else if (NivelDeposito < 1.5 * AlarmaNivelAgua) {
        basic.showLeds(`
            # . . . #
            # . . . #
            # # # # #
            # # # # #
            # # # # #
            `)
    } else if (NivelDeposito < 1.75 * AlarmaNivelAgua) {
        basic.showLeds(`
            # . . . #
            # # # # #
            # # # # #
            # # # # #
            # # # # #
            `)
    } else {
        basic.showLeds(`
            # # # # #
            # # # # #
            # # # # #
            # # # # #
            # # # # #
            `)
    }
}
function EncenderRiego () {
    if (NivelDeposito > AlarmaNivelAgua) {
        pins.digitalWritePin(DigitalPin.P16, 1)
        basic.showLeds(`
            . . # . .
            . # # # .
            # . # . #
            . . # . .
            . . # . .
            `)
    }
}
function ApagarRiego () {
    pins.digitalWritePin(DigitalPin.P16, 0)
    basic.showLeds(`
        . . # . .
        . . # . .
        # . # . #
        . # # # .
        . . # . .
        `)
}
input.onButtonPressed(Button.A, function () {
    EncenderRiego()
})
input.onButtonPressed(Button.B, function () {
    ApagarRiego()
})
function RevisarHumedadSuelo () {
    if (HumedadSuelo < HumedadParaRiego) {
        EncenderRiego()
        while (ValorSensorLluvia < SensorLluviaMojado) {
            ValorSensorLluvia = pins.analogReadPin(AnalogPin.P1)
        }
        ApagarRiego()
    } else {
        ApagarRiego()
    }
}
let ValorSensorLluvia = 0
let HumedadSuelo = 0
let NivelDeposito = 0
let SensorLluviaMojado = 0
let HumedadParaRiego = 0
let AlarmaNivelAgua = 0
serial.redirectToUSB()
AlarmaNivelAgua = 400
HumedadParaRiego = 500
SensorLluviaMojado = 800
basic.forever(function () {
    NivelDeposito = pins.analogReadPin(AnalogPin.P2)
    serial.writeValue("nivelDeposito", NivelDeposito)
    ValorSensorLluvia = pins.analogReadPin(AnalogPin.P1)
    serial.writeValue("SensorLluvia", ValorSensorLluvia)
    HumedadSuelo = pins.analogReadPin(AnalogPin.P0)
    serial.writeValue("HumedadSuelo", HumedadSuelo)
    MostrarNivelAgua()
    RevisarHumedadSuelo()
})
