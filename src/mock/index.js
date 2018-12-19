function getRequest(url) {
    const theRequest = {}
    const index = url.indexOf("?")
    if (index !== -1) {
        const str = url.substr(index + 1);
        const strs = str.split("&");
        for (let i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}

export default function mock({
    type = 'GET',
    data: data,
    url: targetURL,
    // beforeSend,
    success: successCallback,
    // error: errorCallback,
    // complete: completeCallback,
}) {
    const index = targetURL.indexOf("?")
    const params = getRequest(targetURL)
    if (index !== -1) {
        targetURL = targetURL.substring(0, index)
    }

    const flags = {
        isAbort: false,
    }
    const ajaxTools = {
        abort: () => {
            flags.isAbort = true
        }
    }

    function callAPI({
        response: callback,
        delay = 0,
    }) {
        const getData = type === 'GET' || type === 'DELETE' ?
            Object.assign(params, data) :
            getRequest(targetURL)
        const postData = type === 'POST' || type === 'PUT' ? data : {}

        setTimeout(() => {
            if (flags.isAbort) {
                return
            }
            if (typeof callback === 'function') {
                successCallback(callback({
                    params: getData,
                    data: postData,
                }))
            } else {
                successCallback(callback)
            }
        }, delay)
    }

    const URLKeys = Object.keys(this.mockAPI)
    for (let index in URLKeys) {
        const url = URLKeys[index]
        const pattern = new RegExp(url)
        if (pattern.test(targetURL)) {
            const config = this.mockAPI[url]
            const {
                method
            } = config
            if (method && method !== type) {
                continue
            }
            callAPI(config)
            return ajaxTools
        }
    }

    const defaultAPI = this.mockAPI['^/404$']
    defaultAPI ? callAPI(defaultAPI) : null
    return ajaxTools
}