const defaultOptions = {
    selector: '#poster'
};

function Poster(options = {}) {
    options = {
        ...defaultOptions,
        ...options,
    };
    console.log('options',options);
    const pages = getCurrentPages();

    console.log('pages',pages)
    const ctx = pages[pages.length - 1];
    console.log('ctx',ctx)
    const poster = ctx.selectComponent(options.selector);
    console.log('poster1',poster);
    delete options.selector;

    return poster;
};

Poster.create = (reset = false) => {
    const poster  = Poster();
    console.log('poster2',poster);
    if (!poster) {
        console.error('请设置组件的id="poster"!!!');
    } else {
        return Poster().onCreate(reset);
    }
}

export default Poster;