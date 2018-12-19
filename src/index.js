import mock from './mock/index'
import {
    loadTemplate
} from './template/index'
import $ from 'expose-loader?$!jquery'

const DSST = Object.assign(function (target) {
    const inject = $(target)
    return {
        loadTemplate: loadTemplate.bind({
            ...DSST,
            inject,
            baseURL: DSST.baseURL + DSST.templateURL,
        }),
    }
}, {
    ajax: (...args) => DSST.mock ? mock.bind(DSST)(...args) : $.ajax(...args),
    useJQuery: () => {
        window.$ = $
    },
    global: (sign = '$$') => {
        window[sign] = DSST
    },
    baseURL: '/',
    templateURL: 'templates',
    componentURL: 'components',
    mock: false,
    mockAPI: {
        '^/404$': {
            response: {
                code: -1,
                msg: '404 NOT FOUND',
            }
        }
    },
    debug: false,
})

export default DSST