import $ from 'expose-loader?$!jquery'

function getName(url) {
    const l = url.split('/')
    const nl = []
    for (let i in l) {
        if (l[i] !== "" && l[i] != undefined) {
            nl.push(l[i])
        }
    }
    return nl.join('-')
}

export function loadTemplate(URLName, data) {
    const name = getName(URLName)
    this.inject.addClass(`t-${name}`)
    const template = $(`template#dsst-${name}`)

    const renderTemplate = (template, data) => {
        const templateString = template.html().replace(/\${\s*/g, '${data.')
        console.log(templateString, data)
        let content = ''
        try {
            content = eval(`\`${templateString}\``)
        } catch (e) {
            console.error(e)
            if (this.debug) {
                content = `<span class='dsst-debug'>${e.message}</span>`
            }
        }
        this.inject.html(content)
    }

    if (template.length === 0) {
        $.get(`${this.baseURL}/${URLName}.html`, (rep) => {
            $('body').append(`<template id='dsst-${name}'>${rep}</template>`)
            renderTemplate($(`template#dsst-${name}`), data)
        })
    } else {
        renderTemplate(template, data)
    }
}
