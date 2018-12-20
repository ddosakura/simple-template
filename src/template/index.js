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

const hashText = 'kkdvijlw4r83iufy83q98e93u4fhwoefw3'

export function loadTemplate(URLName, data) {
    const name = getName(URLName)
    this.inject.addClass(`t-${name}`)
    const template = $(`template#dsst-${name}`)

    const removeEl = (t) => {
        const attrElse = t.attr('else')
        const attrElif = t.attr('elif')
        let tag = 0
        tag += (attrElif !== undefined)
        tag += (attrElse !== undefined)
        if (tag === 0) {
            return false
        }
        t.remove()
        return true
    }

    // quick fix by eval
    const evalVal = (attr) => {
        const temp = '`' + attr + '`'
        console.log('evalVal', attr, temp)
        const script = temp.replace(/[^\\]\${\s*/g, '$&data.')
        console.log('script', script)
        const ret = eval(script)
        console.log(ret)
        return ret
    }

    const renderIf = (t, attr) => {
        // console.log(`data.${attr}`, attr === true ? null : eval(`data.${attr}`))
        const isNum = /^((\d+(\.\d+)?)|(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))))$/.test(attr)
        if (attr === true ||
            isNum && parseFloat(attr) ||
            !isNum && eval(`data.${attr}`)) {
            const c = t.children()
            const ts = []
            for (let i = 0; i < c.length; i++) {
                ts.push(c[i].outerHTML)
            }
            t.after(...ts)
        } else {
            const nextT = t.next()
            if (nextT.length === 0) {
                return
            }
            if (nextT[0].localName !== 'dsst') {
                return
            }
            const attrElse = nextT.attr('else')
            const attrElif = nextT.attr('elif')
            let tag = 0
            tag += (attrElif !== undefined)
            tag += (attrElse !== undefined)
            if (tag === 0) {
                return
            }
            if (tag > 1) {
                throw new Error('you can only set one of if/elif/else/for in <dsst>')
            }
            // quick fix by eval
            renderIf(nextT, evalVal(attrElif ? attrElif : true))
        }
    }

    const renderFor = (t, attr) => {
        const c = t.children()
        const list = eval(`data.${attr}`)
        const ts = []
        for (let index in list) {
            for (let i = 0; i < c.length; i++) {
                const nextT = $(c[i])
                if (nextT[0].localName === 'dsst' &&
                    nextT.attr('for') !== undefined) {
                    const temp = nextT.attr('for')
                    const s1 = temp
                        .replace(/[^\\]\${\s*((item)|(index\s*}))/g, '$&' + hashText)
                    const s2 = s1.replace(new RegExp(`\\\${\\s*item${hashText}`, 'g'), `\${${attr}[${index}]`)
                    const s3 = s2.replace(new RegExp(`\\\${\\s*index\s*}${hashText}`, 'g'), `${index}`)
                    nextT.attr('for', s3)
                    console.log(s1, s2, s3)
                    ts.push(c[i].outerHTML)
                    nextT.attr('for', temp)
                    continue
                }
                const s1 = c[i].outerHTML
                    .replace(/[^\\]\${\s*((item)|(index\s*}))/g, '$&' + hashText)
                const s2 = s1.replace(new RegExp(`\\\${\\s*item${hashText}`, 'g'), `\${${attr}[${index}]`)
                const s3 = s2.replace(new RegExp(`\\\${\\s*index\s*}${hashText}`, 'g'), `${index}`)
                console.log(s1, s2, s3)
                ts.push(s3)
            }
        }
        t.after(...ts)
    }

    const renderDSST = (dsst) => {
        console.log('dsst', dsst)
        const ret = dsst.length
        // const waitRemove = []
        for (let index = 0; index < ret; index++) {
            const t = $(dsst[index])
            const attrIf = t.attr('if')
            const attrElse = t.attr('else')
            const attrElif = t.attr('elif')
            const attrFor = t.attr('for')
            let tag = 0
            tag += (attrIf !== undefined)
            tag += (attrElif !== undefined)
            tag += (attrElse !== undefined)
            tag += (attrFor !== undefined)
            if (tag === 0) {
                throw new Error('you should set if/elif/else/for in <dsst>')
            }
            if (tag > 1) {
                throw new Error('you can only set one of if/elif/else/for in <dsst>')
            }

            if (attrIf !== undefined) {
                if (/((\${\s*index\s*})|(\${\s*item))/.test(attrIf)) {
                    continue
                }
                // quick fix by eval
                renderIf(t, evalVal(attrIf))
                t.remove()
                let continueRemove = removeEl($(dsst[++index]))
                while (continueRemove) continueRemove = removeEl($(dsst[++index]))
                index--
                // waitRemove.push(t)
                // t.remove()
            }

            if (attrElif !== undefined || attrElse !== undefined) {
                // waitRemove.push(t)
                // t.remove()
            }

            if (attrFor !== undefined) {
                console.log('before', window.clone.html())
                console.log('fresh', window.temp.find('dsst'))
                console.log('index', index)
                console.log('dsst', dsst)
                console.log('t', t)
                console.log('attrFor', attrFor)
                if (/((\${\s*index\s*})|(\${\s*item))/.test(attrFor)) {
                    continue
                }
                // quick fix by eval
                renderFor(t, evalVal(attrFor))
                // waitRemove.push(t)
                t.remove()
                console.log('after', window.clone.html())
            }
        }
        // console.log(waitRemove)
        // for (let index = 0; index < waitRemove.length; index++) {
        //     waitRemove[index].remove()
        // }
        return ret
    }
    const renderTemplate = (template) => {
        const clone = $(document.importNode(template, true))
        window.clone = clone
        const temp = $(clone[0].content)
        window.temp = temp

        let doDSST = 1

        console.log('------------------------------------------')
        // TODO: remove times limit
        let times = 0
        while (doDSST > 0 && times++ < 6) {
            const ttt = temp.find('dsst')
            console.log('ttt', ttt)
            // TODO: render policy by dom
            doDSST = renderDSST(ttt)
        }
        console.log(times)

        const templateString = clone.html().replace(/[^\\]\${\s*/g, '$&data.')
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
            renderTemplate($(`template#dsst-${name}`)[0])
        })
    } else {
        renderTemplate(template[0])
    }
}