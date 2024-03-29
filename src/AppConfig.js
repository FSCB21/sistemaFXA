import React, { useCallback, useEffect, useRef, useState } from 'react';
import { RadioButton } from 'primereact/radiobutton';
import classNames from 'classnames';
import {Button} from "primereact/button";
import { Divider } from 'primereact/divider';
import { useHistory } from 'react-router-dom';

export const AppConfig = (props) => {

    const history = new useHistory()

    const [active, setActive] = useState(false);
    const scale  = 13;
    
    const themeColor = localStorage.getItem('themeColor')

    const [theme, setTheme] = useState(themeColor?themeColor:'arya-purple');
    const config = useRef(null);
    let outsideClickListener = useRef(null);

    const unbindOutsideClickListener = useCallback(() => {
        if (outsideClickListener.current) {
            document.removeEventListener('click', outsideClickListener.current);
            outsideClickListener.current = null;
        }
    }, []);

    const hideConfigurator = useCallback((event) => {
        setActive(false);
        unbindOutsideClickListener();
        event.preventDefault();
    }, [unbindOutsideClickListener]);

    const bindOutsideClickListener = useCallback(() => {
        if (!outsideClickListener.current) {
            outsideClickListener.current = (event) => {
                if (active && isOutsideClicked(event)) {
                    hideConfigurator(event);
                }
            };
            document.addEventListener('click', outsideClickListener.current);
        }
    }, [active, hideConfigurator]);

    useEffect(() => {
        if (active) {
            bindOutsideClickListener()
        }
        else {
            unbindOutsideClickListener()
        }
    }, [active, bindOutsideClickListener, unbindOutsideClickListener]);

    const isOutsideClicked = (event) => {
        return !(config.current.isSameNode(event.target) || config.current.contains(event.target));
    }


    useEffect(() => {
        document.documentElement.style.fontSize = scale + 'px';
    }, [scale])

    const toggleConfigurator = (event) => {
        setActive(prevState => !prevState);
    }

    const configClassName = classNames('layout-config', {
        'layout-config-active': active
    })

    const replaceLink = useCallback((linkElement, href, callback) => {
        if (isIE()) {
            linkElement.setAttribute('href', href);

            if (callback) {
                callback();
            }
        }
        else {
            const id = linkElement.getAttribute('id');
            const cloneLinkElement = linkElement.cloneNode(true);

            cloneLinkElement.setAttribute('href', href);
            cloneLinkElement.setAttribute('id', id + '-clone');

            linkElement.parentNode.insertBefore(cloneLinkElement, linkElement.nextSibling);

            cloneLinkElement.addEventListener('load', () => {
                linkElement.remove();
                cloneLinkElement.setAttribute('id', id);

                if (callback) {
                    callback();
                }
            });
        }
    },[])

    useEffect(() => {
        let themeElement = document.getElementById('theme-link');
        const themeHref = 'assets/themes/' + theme + '/theme.css';
        replaceLink(themeElement, themeHref);

    },[theme,replaceLink])

    const isIE = () => {
        return /(MSIE|Trident\/|Edge\/)/i.test(window.navigator.userAgent)
    }

    const changeTheme = (e, theme, scheme) => {
        localStorage.setItem('themeColor', theme)
        localStorage.setItem('scheme', scheme)
        props.onColorModeChange(scheme);
        setTheme(theme);
    }

    const changeMenuDisplay = (e) =>{
        props.onLayoutModeChange(e.value)
        localStorage.setItem('menuDisplay', e.value)
    }

    return (
        <div ref={config} className={configClassName} id={"layout-config"}>
            <button className="layout-config-button p-link" id="layout-config-button" onClick={toggleConfigurator}>
                <i className="pi pi-cog"></i>
            </button>
            <Button className="p-button-danger layout-config-close p-button-rounded p-button-text" icon="pi pi-times" onClick={hideConfigurator}/>

            <div className="layout-config-content">


                <h5>Tipo Menu</h5>
                <div className="p-formgroup-inline">
                    <div className="field-radiobutton">
                        <RadioButton inputId="static" name="layoutMode" value="static" onChange={(e) => changeMenuDisplay(e)} checked={props.layoutMode === 'static'} />
                        <label htmlFor="static">Estatico</label>
                    </div>
                    <div className="field-radiobutton">
                        <RadioButton inputId="overlay" name="layoutMode" value="overlay" onChange={(e) => changeMenuDisplay(e)} checked={props.layoutMode === 'overlay'} />
                        <label htmlFor="overlay">Oculto</label>
                    </div>
                </div>

                <Divider layout='horizontal'/>

                <h5>Temas</h5>
                <div className="grid free-themes">
                    <div className="col-12">
                        <button className="p-link" onClick={e => changeTheme(e, 'saga-purple', 'light')}>
                            <img src="assets/layout/images/themes/saga-purple.png" alt="Saga Purple"/>
                        </button>
                        <span className='text-xl mx-3'>Claro</span>
                    </div>
                    <div className="col-12">
                        <button className="p-link" onClick={e => changeTheme(e, 'vela-purple', 'dim')}>
                            <img src="assets/layout/images/themes/vela-purple.png" alt="Vela Purple"/>
                        </button>
                        <span className='text-xl mx-3'>Profundo</span>
                    </div>
                    <div className="col-12">
                        <button className="p-link" onClick={e => changeTheme(e, 'arya-purple', 'dark')}>
                            <img src="assets/layout/images/themes/arya-purple.png" alt="Arya Purple"/>
                        </button>
                        <span className='text-xl mx-3'>Oscuro</span>
                    </div>
                </div>

                <Divider layout='horizontal'/>
                <h5>¿Como Funciona SIGE?</h5>
                <div className="grid">
                    <div className="col-12">
                        <button className="p-link" onClick={e => history.push('/guia-uso')}>
                            <i className='pi pi-book'/>
                        </button>
                        <span className='text-xl mx-3'>Documentación</span>
                    </div>
                    
                </div>

            </div>
        </div>
    );
}
