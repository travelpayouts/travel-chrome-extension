import {html} from 'lit-html';
import {repeat} from 'lit-html/directives/repeat';
import {translate} from "@appnest/lit-translate";
import {signs} from "./currencies";

export const languages = {"en": "English", "ru": "Русский"};

export let currency_label = (c) => html`<span class="currency-sign">${signs[c.toLowerCase()]}</span>
							${translate('auto_generated.currency.translations.' + c.toLowerCase())}`;

let index_template = (currencies, settings) => html`<a id="logo" href="https://www.aviasales.ru/?utm_source=inspiration_tab" target="_blank">
    <img class="logo-aviasales" src="../img/logo.png" alt="">
</a>

<div class="block block--top block--right">
    <div class="buttons-block">
        <div class="button-container">
            <button class="button button--rotate button--scale" id="btn_change_destination" type="button">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <g fill="#FFF" fill-rule="evenodd">
                        <path fill-rule="nonzero" d="M19.177 21.619l-.13.714a1 1 0 0 0 1.967.36l.69-3.784a1.062 1.062 0 0 0-1.242-1.241l-3.782.69a1 1 0 0 0 .358 1.967l.688-.125a10.004 10.004 0 0 1-9.79.931 9.995 9.995 0 0 1-5.592-11.72 1 1 0 0 0-1.932-.517c-1.715 6.402 2.084 12.982 8.485 14.697a11.962 11.962 0 0 0 10.28-1.972zM4.826 2.384l.13-.714a1 1 0 0 0-1.967-.36l-.69 3.784a1.062 1.062 0 0 0 1.242 1.241l3.782-.69a1 1 0 0 0-.358-1.967l-.688.125a10.004 10.004 0 0 1 9.79-.931 9.995 9.995 0 0 1 5.592 11.72 1 1 0 1 0 1.932.517C25.306 8.707 21.507 2.127 15.106.412a11.962 11.962 0 0 0-10.28 1.972z"/>
                        <path d="M9.308 10.755c.195-.604.85-1.255 1.447-1.447l5.526-2.33c.604-.195.934.143.741.741l-2.33 5.526c-.195.604-.85 1.255-1.447 1.447l-5.526 2.33c-.604.195-.934-.143-.741-.741l2.33-5.526zm1.278 2.66a2 2 0 1 0 2.828-2.83 2 2 0 0 0-2.828 2.83z"/>
                    </g>
                </svg>
            </button>
            <span class="button-tooltip button-tooltip--left">${translate('titles.other_direction')}</span>
            <span class="button-tooltip button-tooltip--left button-tooltip_loading">${translate('titles.loading')}</span>
        </div>
        <div class="button-container">
            <button class="button button--rotate button--scale" id="btn_settings" type="button">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="#FFF" fill-rule="nonzero"
                          d="M10.612 2.859L10.2 5.737A2 2 0 0 1 7.476 7.31L4.777 6.227a1 1 0 0 0-1.238.428l-.398.69a1 1 0 0 0 .248 1.286l2.288 1.796a2 2 0 0 1 0 3.146L3.389 15.37a1 1 0 0 0-.248 1.286l.398.69a1 1 0 0 0 1.238.428l2.699-1.083a2 2 0 0 1 2.725 1.573l.41 2.878a1 1 0 0 0 .99.859h.797a1 1 0 0 0 .99-.859l.411-2.878a2 2 0 0 1 2.725-1.573l2.699 1.083a1 1 0 0 0 1.238-.428l.398-.69a1 1 0 0 0-.248-1.286l-2.288-1.796a2 2 0 0 1 0-3.146l2.288-1.796a1 1 0 0 0 .248-1.286l-.398-.69a1 1 0 0 0-1.238-.428L16.524 7.31A2 2 0 0 1 13.8 5.737l-.41-2.878a1 1 0 0 0-.99-.859h-.797a1 1 0 0 0-.99.859zM8.22 5.454l.534-3.737A2 2 0 0 1 10.735 0h2.53a2 2 0 0 1 1.98 1.717l.534 3.737 3.504-1.406a2 2 0 0 1 2.477.856l1.265 2.192a2 2 0 0 1-.497 2.573L19.558 12l2.97 2.33a2 2 0 0 1 .497 2.574l-1.265 2.192a2 2 0 0 1-2.477.856l-3.504-1.406-.534 3.737A2 2 0 0 1 13.265 24h-2.53a2 2 0 0 1-1.98-1.717l-.534-3.737-3.504 1.406a2 2 0 0 1-2.477-.856L.975 16.904a2 2 0 0 1 .497-2.573L4.442 12l-2.97-2.33a2 2 0 0 1-.497-2.574L2.24 4.904a2 2 0 0 1 2.477-.856l3.504 1.406zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0-2a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/>
                </svg>
            </button>
            <div class="button-menu block--top block--right">
                <div class="button-menu__close block--top block--right">
                    <button class="button button-close" id="btn_close_settings">
                        <img src="../img/close-settings.svg" alt="close">
                    </button>
                </div>

                <h3 class="button-menu__title">${translate('titles.settings')}</h3>
                
                <div class="button-menu__paragraph">
                    <label class="input-label">${translate('titles.lang_label')}</label>
                    <div class="wrapper-select-dropdown" id="choose_lang">
						<span class="wrapper-select-dropdown__label" id="lang_label"></span>
                        <ul class="dropdown" id="lang_dropdown">
                            ${repeat(Object.keys(languages), language => html`
                                <li data-lang="${language}">
                                    <img src="../img/check.svg" alt=""></span>${languages[language]}
                                </li>
                            `)}
                        </ul>
                    </div>
                </div>
                
                <div class="button-menu__paragraph">
                    <label class="input-label">${translate('titles.currency')}</label>
                    <div class="wrapper-select-dropdown" id="choose_currency">
						<span class="wrapper-select-dropdown__label" id="currency_label">
						${currency_label(settings.currency[0])}
						</span>
                        <ul class="dropdown" id="currency_dropdown">
                            ${repeat(currencies.order, currency => html`<li data-currency="${currency.toUpperCase()}">
                                <img src="../img/check.svg" alt="">
                                ${signs[currency] ? html`
                                <span class="currency-sign">${signs[currency]}</span>` : ''}
                                ${translate('auto_generated.currency.translations.' + currency.toLowerCase())}
                                </li>`)}
                        </ul>
                    </div>
                </div>

                <div class="button-menu__paragraph">
                    <label class="input-label">${translate('titles.departure_city')}</label>
                    <div class="wrapper-input-dropdown">
                        <input type="text" class="input-text" id="input_origin_city" value="" @focus=${e => e.target.value = ''}>
                    </div>
                </div>

                <div class="button-menu__paragraph">
                    <label class="input-label">${translate('titles.exclude_cities')}</label>
                    <div class="wrapper-input-dropdown">
                        <input type="text" class="input-text" placeholder="${translate('titles.enter_city_name')}"
                               id="hide_cities" @blur=${e => e.target.value = ''}>
                    </div>
                    <div class="hidden-cities" id="exclude_cities"></div>
                </div>
                
                <div class="button-menu__paragraph comments">
                    <label class="control-checkbox">${translate('titles.hide_comments')}
                        <input type="checkbox" id="toggle_comments">
                        <div class="control-checkbox__indicator"></div>
                    </label>
                </div>

                <div class="button-menu__paragraph tags">
                    <label class="control-checkbox">${translate('titles.hide_tags')}
                        <input type="checkbox" id="toggle_tags">
                        <div class="control-checkbox__indicator"></div>
                    </label>
                </div>

            </div>
            <span class="button-tooltip button-tooltip--left">${translate('titles.settings')}</span>
        </div>
    </div>
</div>

<div class="place-container" id="place_container">
    <div class="block block--bottom block--left">
        <div class="btn-container hidden show-animate">
            <a href="" id="btn_price" target="_blank">
                <div class="btn-price">
                    <span class="price-from">${translate('titles.from')}</span>
                    <span class="btn-price-value"></span>
                    <span class="currency-symbol"></span>

                    <div class="price-tooltip price-tooltip--hidden" id="price_tooltip">7 сентября – 14 сентября (6
                        ночей)
                    </div>
                </div>
            </a>

            <div class="prices-calendar-container prices-calendar-container--hidden" id="prices_calendar"></div>
        </div>

        <div class="destination hidden show-animate" id="destination"></div>

        <div class="origin-container hidden show-animate">
            <div class="origin" id="origin">${translate('titles.from_city')} <span></span></div>
        </div>

        <div class="tags-container hidden show-animate" id="tags_container">
            <div class="tags"></div>
        </div>
    </div>

    <div class="block block--bottom block--right">
        <div class="review-container" id="comments_container">
            <div class="review hidden show-animate">
                <img class="quote" src="../img/icon_quote.svg">
                <div class="review-content">
                    <div class="review-title"></div>
                    <div class="review-text"></div>
                    <div class="review-author"></div>
                    <!--<div class="review-date"></div>-->
                </div>
            </div>
        </div>
    </div>

    <div class="block block--bottom block--center" style="display:none;">
        <div class="button-container" id="btn-bottombar">
            <button class="button button--scale">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="#FFF" fill-rule="evenodd" d="M7.41 8L12 12.58 16.59 8 18 9.41l-6 6-6-6z"/>
                </svg>
            </button>
            <span class="button-tooltip button-tooltip--top">${translate('titles.other_directions')}</span>
        </div>
    </div>

    <div class="blackout hidden show-animate"></div>

    <div class="bg-image" id="bg_img"></div>
</div>


<div class="preloader-overlay is-hidden" id="overlay">
    <div class="preloader-overlay__content">
        <svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 250">
            <style>.st0 {
                fill: #00a5dd
            }

            .st1 {
                fill: #4b4b4b
            }

            .st2 {
                fill: #fff
            }

            .st3, .st4 {
                opacity: .2;
                fill: #00a5dd
            }

            .st4 {
                fill: #b3b3b3
            }

            .st5 {
                opacity: .1;
                fill: #00a5dd
            }

            .st6 {
                opacity: .2
            }

            .st7 {
                fill: #ccc
            }</style>
            <g class="airplane_wrapper">
                <path class="airplane_line_1 st0"
                      d="M39.2 48.5c-.1-.1-.2-.3-.2-.5 0-.4.3-.7.7-.7h10.2c.4 0 .7.3.7.7 0 .4-.3.7-.7.7H39.7c-.2 0-.4-.1-.5-.2zm18.2.2h1.5c.4 0 .7-.3.7-.7 0-.4-.3-.7-.7-.7h-1.5c-.4 0-.7.3-.7.7 0 .2.1.4.2.5.1.1.3.2.5.2zm5.4 0h14.9c.4 0 .7-.3.7-.7 0-.4-.3-.7-.7-.7H62.8c-.4 0-.7.3-.7.7 0 .2.1.4.2.5.2.1.4.2.5.2zm22.4 0h1.5c.4 0 .7-.3.7-.7 0-.4-.3-.7-.7-.7h-1.5c-.4 0-.7.3-.7.7 0 .2.1.4.2.5s.3.2.5.2zm5.5 0h10.2c.4 0 .7-.3.7-.7 0-.4-.3-.7-.7-.7H90.7c-.4 0-.7.3-.7.7 0 .2.1.4.2.5.2.1.3.2.5.2z"></path>
                <path class="airplane_line_2 st0"
                      d="M98.1 80.9c-.1-.1-.2-.3-.2-.5 0-.4.3-.7.7-.7h3.4c.4 0 .7.3.7.7 0 .4-.3.7-.7.7h-3.4c-.2 0-.4-.1-.5-.2zm6.4.2h2c.4 0 .7-.3.7-.7 0-.4-.3-.7-.7-.7h-2c-.4 0-.7.3-.7.7 0 .2.1.4.2.5.1.1.3.2.5.2zm6.9 0h3.4c.4 0 .7-.3.7-.7 0-.4-.3-.7-.7-.7h-3.4c-.4 0-.7.3-.7.7 0 .2.1.4.2.5.1.1.3.2.5.2z"></path>
                <path class="airplane_line_3 st0"
                      d="M6.4 92.8c-.1-.1-.2-.3-.2-.5 0-.4.3-.7.7-.7h3.6c.4 0 .7.3.7.7 0 .4-.3.7-.7.7H6.9c-.2 0-.3-.1-.5-.2zm9.1 0c-.1-.1-.2-.3-.2-.5 0-.4.3-.7.7-.7h2c.4 0 .7.3.7.7 0 .4-.3.7-.7.7h-2c-.2 0-.4-.1-.5-.2zm12.3 0c-.1-.1-.2-.3-.2-.5 0-.4.3-.7.7-.7h20.4c.4 0 .7.3.7.7 0 .4-.3.7-.7.7H28.3c-.2 0-.4-.1-.5-.2z"></path>
                <path class="airplane_line_4 st0"
                      d="M32.8 125.5c-.1-.1-.2-.3-.2-.5 0-.4.3-.7.7-.7h13.5c.4 0 .7.3.7.7 0 .4-.3.7-.7.7H33.3c-.2 0-.4-.1-.5-.2z"></path>
                <path class="airplane_line_5 st0"
                      d="M45.1 157.8c-.1-.1-.2-.3-.2-.5 0-.4.3-.7.7-.7H49c.4 0 .7.3.7.7 0 .4-.3.7-.7.7h-3.4c-.2 0-.3 0-.5-.2zm-5.4.2h2.6c.4 0 .7-.3.7-.7 0-.4-.3-.7-.7-.7h-2.6c-.4 0-.7.3-.7.7 0 .2.1.4.2.5.2.1.3.2.5.2zm-10 0h3.4c.4 0 .7-.3.7-.7 0-.4-.3-.7-.7-.7h-3.4c-.4 0-.7.3-.7.7 0 .2.1.4.2.5.2.1.4.2.5.2z"></path>
                <path class="airplane_line_6 st0"
                      d="M85.2 152c-.1-.1-.2-.3-.2-.5 0-.4.3-.7.7-.7h10.2c.4 0 .7.3.7.7 0 .4-.3.7-.7.7H85.7c-.2 0-.4-.1-.5-.2zm19.3.2h1.7c.4 0 .7-.3.7-.7 0-.4-.3-.7-.7-.7h-1.7c-.4 0-.7.3-.7.7 0 .2.1.4.2.5.1.1.3.2.5.2zm6.3 0H121c.4 0 .7-.3.7-.7 0-.4-.3-.7-.7-.7h-10.2c-.4 0-.7.3-.7.7 0 .2.1.4.2.5.1.1.3.2.5.2z"></path>
                <path class="airplane_line_7 st0"
                      d="M99.5 179.1c-.1-.1-.2-.3-.2-.5 0-.4.3-.7.7-.7h11.3c.4 0 .7.3.7.7 0 .4-.3.7-.7.7H100c-.2 0-.4-.1-.5-.2z"></path>
                <path class="airplane_line_8 st0"
                      d="M79.2 202.5c-.1-.1-.2-.3-.2-.5 0-.4.3-.7.7-.7h21.2c.4 0 .7.3.7.7 0 .4-.3.7-.7.7H79.7c-.2 0-.4-.1-.5-.2z"></path>
                <path class="st1" d="M134.2 141.3h7.2v2.4h-7.2z"></path>
                <circle class="st1" cx="134.2" cy="142.5" r="1.2"></circle>
                <path class="st1" d="M131.8 150.3h7.2v2.4h-7.2z"></path>
                <circle class="st1" cx="131.8" cy="151.5" r="1.2"></circle>
                <path class="st1" d="M125.6 168.4h7.2v2.4h-7.2z"></path>
                <circle class="st1" cx="125.6" cy="169.6" r="1.2"></circle>
                <path class="st1" d="M122.1 177.4h7.2v2.4h-7.2z"></path>
                <circle class="st1" cx="122.1" cy="178.6" r="1.2"></circle>
                <g>
                    <path class="st2"
                          d="M137.3 175.5l14.6.1c.4 0 .8.2 1.1.4.3.3.4.7.4 1.1v7.4c0 .4-.1.8-.4 1.1-.3.3-.7.4-1.1.4l-14.6-.1v-10.4z"></path>
                    <path class="st3" d="M135.9 187.3l15.9.1c.8 0 1.5-.3 2-.8s.8-1.3.8-2v-3.8h-18.8l.1 6.5z"></path>
                    <path class="st1"
                          d="M135.9 187.3v-13.2l15.9.1c.8 0 1.5.3 2 .8s.8 1.3.8 2v7.4c0 .8-.3 1.5-.8 2s-1.3.8-2 .8l-15.9.1zm2.7-10.5v7.7l13.2.1h.1v-7.5-.1h-.1l-13.2-.2z"></path>
                    <path class="st1"
                          d="M140.3 181.7c-.2-.2-.4-.6-.4-1 0-.8.6-1.4 1.4-1.4h7.8c.8 0 1.4.6 1.4 1.4 0 .8-.6 1.4-1.4 1.4h-7.8c-.4 0-.8-.2-1-.4z"></path>
                </g>
                <g>
                    <path class="st2"
                          d="M161 150.3l13.3.1c.4 0 .8.2 1.1.4.3.3.4.7.4 1.1v7.4c0 .4-.1.8-.4 1.1-.3.3-.7.4-1.1.4l-13.2-.1v-10.4z"></path>
                    <path class="st3" d="M159.6 162.1l14.6.1c.8 0 1.5-.3 2-.8s.8-1.3.8-2v-3.8h-17.5l.1 6.5z"></path>
                    <path class="st1"
                          d="M159.6 162.1v-13.2l14.6.1c.8 0 1.5.3 2 .8s.8 1.3.8 2v7.4c0 .8-.3 1.5-.8 2s-1.3.8-2 .8l-14.6.1zm2.7-10.4v7.7l11.9.1h.1V152v-.1h-.1l-11.9-.2z"></path>
                    <path class="st1"
                          d="M163.8 156.5c-.2-.2-.4-.6-.4-1 0-.8.6-1.4 1.4-1.4h6.7c.8 0 1.4.6 1.4 1.4 0 .8-.6 1.4-1.4 1.4h-6.7c-.4 0-.8-.1-1-.4z"></path>
                </g>
                <g>
                    <path class="st2"
                          d="M177.5 137c-8.4 13.8-50.1 65.7-50.1 65.7h-11.3c5.8-11.8 23.2-54.5 23.2-66 .1-8.4 38.2.3 38.2.3z"></path>
                    <path class="st3"
                          d="M177.5 137c-8.4 13.8-50.1 65.7-50.1 65.7h-11.3c5.8-11.8 23.2-54.5 23.2-66 .1-8.4 38.2.3 38.2.3z"></path>
                    <path class="st3"
                          d="M167.8 150.9c1.4-1.8 2.6-3.6 3.8-5.2h-33.8c-.4 1.6-.9 3.4-1.5 5.2h31.5zM163.3 157c1.1-1.5 2.2-2.9 3.2-4.3h-30.7c-.4 1.4-.9 2.8-1.4 4.3h28.9zM176.5 138.7h-37.3c-.2 1.7-.6 3.8-1.2 6.1h34.2c1.8-2.4 3.2-4.4 4.3-6.1zM158.6 163.1c.9-1.1 1.7-2.3 2.6-3.4h-27.7c-.4 1.1-.8 2.3-1.2 3.4h26.3zM144.4 181.4c.2-.2.4-.5.5-.7h-19.3c-.1.2-.2.5-.3.7h19.1zM149.2 175.3c.4-.5.8-1.1 1.2-1.6h-22c-.2.5-.4 1.1-.6 1.6h21.4zM153.9 169.2c.6-.8 1.3-1.7 1.9-2.5H131c-.3.8-.6 1.7-.9 2.5h23.8z"></path>
                    <path class="st1"
                          d="M115.2 203.7c-.1-.1-.1-.2-.2-.2-.2-.4-.3-.9-.1-1.3 5.9-12.1 23-54.3 23-65.5 0-1.2.5-2.3 1.5-3 6.4-5.1 35.1 1.3 38.3 2 .4.1.8.4 1 .8.2.4.1.9-.1 1.2-8.3 13.7-48.5 63.8-50.2 65.9-.3.3-.6.5-1.1.5H116c-.2 0-.5-.1-.8-.4zm60.1-65.8c-11.9-2.6-30.3-5.2-34.1-2.1-.4.3-.5.7-.5.9 0 11.4-16 50.9-22.4 64.7h8.5c4.2-5.2 38.9-48.7 48.5-63.5z"></path>
                </g>
                <g>
                    <path class="st1"
                          d="M146.9 138.4c-.4 3.9-2.1 10.4-5 19h-6.2c2.9-8.7 4.5-15 4.9-19h6.3zm1.5-1.4h-9c-.1 4.3-2.4 12.5-5.5 21.7h9c3.1-9.2 5.4-17.4 5.5-21.7zM139.7 163.7c-2.9 8-5.8 15.5-8 20.7h-6.1c2.2-5.4 5.1-12.9 7.9-20.7h6.2zm1.9-1.3h-9c-2.8 7.9-6 16.2-9 23.5h9c3-7.3 6.2-15.7 9-23.5z"></path>
                </g>
                <g>
                    <path class="st1" d="M134.2 106.3h7.2v2.4h-7.2z"></path>
                    <circle class="st1" cx="134.2" cy="107.5" r="1.2"></circle>
                    <path class="st1" d="M131.8 97.2h7.2v2.4h-7.2z"></path>
                    <circle class="st1" cx="131.8" cy="98.5" r="1.2"></circle>
                    <path class="st1" d="M125.6 79.2h7.2v2.4h-7.2z"></path>
                    <circle class="st1" cx="125.6" cy="80.4" r="1.2"></circle>
                    <path class="st1" d="M122.1 70.2h7.2v2.4h-7.2z"></path>
                    <circle class="st1" cx="122.1" cy="71.4" r="1.2"></circle>
                    <g>
                        <path class="st2"
                              d="M161 99.7l13.3-.1c.4 0 .8-.2 1.1-.4.3-.3.4-.7.4-1.1v-7.4c0-.4-.1-.8-.4-1.1-.3-.3-.7-.4-1.1-.4H161v10.5z"></path>
                        <path class="st3"
                              d="M159.6 94.4v6.6l14.6-.1c.8 0 1.5-.3 2-.8s.8-1.3.8-2v-3.7h-17.4z"></path>
                        <path class="st1"
                              d="M159.6 101V87.9l14.6-.1c.8 0 1.5.3 2 .8s.8 1.3.8 2V98c0 .8-.3 1.5-.8 2s-1.3.8-2 .8l-14.6.2zm2.7-10.4v7.7l11.9-.1h.1v-7.5-.1h-12z"></path>
                        <path class="st1"
                              d="M163.8 95.4c-.2-.2-.4-.6-.4-1 0-.8.6-1.4 1.4-1.4h6.7c.8 0 1.4.6 1.4 1.4 0 .8-.6 1.4-1.4 1.4h-6.7c-.4 0-.8-.2-1-.4z"></path>
                    </g>
                    <g>
                        <path class="st2"
                              d="M137.3 74.5l14.6-.1c.4 0 .8-.2 1.1-.4.3-.3.4-.7.4-1.1v-7.4c0-.4-.1-.8-.4-1.1-.3-.3-.7-.4-1.1-.4l-14.6.1v10.4z"></path>
                        <path class="st3"
                              d="M135.9 75.9l15.9-.1c.8 0 1.5-.3 2-.8s.8-1.3.8-2v-3.7h-18.8l.1 6.6z"></path>
                        <path class="st1"
                              d="M135.9 75.9V62.7l15.9-.1c.8 0 1.5.3 2 .8s.8 1.3.8 2v7.4c0 .8-.3 1.5-.8 2s-1.2.8-2 .8l-15.9.3zm2.7-10.5v7.7l13.2-.1h.1v-7.5-.1H138.6z"></path>
                        <path class="st1"
                              d="M140.3 70.2c-.2-.2-.4-.6-.4-1 0-.8.6-1.4 1.4-1.4h7.8c.8 0 1.4.6 1.4 1.4 0 .8-.6 1.4-1.4 1.4h-7.8c-.4 0-.8-.1-1-.4z"></path>
                    </g>
                    <g>
                        <path class="st2"
                              d="M177.5 113c-8.4-13.8-50.1-65.7-50.1-65.7h-11.3c5.8 11.8 23.2 54.5 23.2 66 .1 8.4 38.2-.3 38.2-.3z"></path>
                        <path class="st3"
                              d="M125.8 69.6c.1.2.2.5.3.7h19.6c-.2-.2-.4-.5-.5-.7h-19.4zM156.4 84c-.5-.7-1-1.4-1.6-2h-24.3c.3.7.5 1.4.7 2h25.2zM161.7 90.9l-2.1-2.7h-26.8l.9 2.7h28zM151.1 77.1c-.4-.5-.7-.9-1.1-1.4h-21.8c.2.5.3.9.5 1.4h22.4zM166.9 97.8c-.8-1.1-1.7-2.2-2.5-3.4H135c.4 1.2.7 2.3 1.1 3.4h30.8zM176.7 111.6c-.9-1.4-2-3-3.2-4.8h-35c.4 1.8.7 3.4.8 4.8h37.4zM171.9 104.7a84 84 0 0 0-3-4.1h-32.1c.4 1.4.8 2.8 1.1 4.1h34z"></path>
                        <path class="st1"
                              d="M139.1 116c-.7-.7-1.1-1.7-1.1-2.7 0-11.1-17.1-53.3-23-65.4-.2-.4-.2-.9.1-1.3.2-.4.7-.6 1.2-.6h11.3c.4 0 .8.2 1.1.5 1.7 2.1 41.8 52.2 50.2 65.9.2.4.3.8.1 1.2-.2.4-.5.7-1 .8-3.3.7-32 7.1-38.3 2-.3-.2-.5-.3-.6-.4zm-20.8-67.4c6.4 13.8 22.4 53.2 22.4 64.7 0 .3.1.6.5.9 3.8 3 22.2.4 34.1-2.1-9.6-14.7-44.4-58.2-48.5-63.5h-8.5z"></path>
                    </g>
                    <g>
                        <path class="st1"
                              d="M141.9 92.6c2.9 8.6 4.6 15.1 5 19h-6.3c-.4-4-2-10.4-4.9-19h6.2zm.9-1.4h-9c3.1 9.3 5.4 17.4 5.5 21.7h9c0-4.2-2.3-12.4-5.5-21.7zM131.7 65.5c2.2 5.3 5.1 12.8 8 20.7h-6.1c-2.8-7.8-5.7-15.3-7.9-20.7h6zm.9-1.3h-9c3 7.3 6.2 15.6 9 23.5h9c-2.8-7.9-6-16.3-9-23.5z"></path>
                    </g>
                </g>
                <g>
                    <path class="st2"
                          d="M214.3 113h-100C86 113 63 121.8 63 125c0 3.2 23 12 51.3 12h100c7.3 0 27.8-6.9 27.8-12 0-5.2-20.4-12-27.8-12z"></path>
                    <path class="st4" d="M106 125H63c0 2.9 18.6 10.3 43 11.8V125z"></path>
                    <path class="st1"
                          d="M62.6 127c-.6-.6-1-1.3-1-2 0-3.6 11.2-7.2 16-8.5 6.5-1.8 19.8-4.9 36.7-4.9h100c3.8 0 10.9 1.7 17.2 4.2 8 3.1 12 6.2 12 9.2 0 3-4 6.1-12 9.2-6.3 2.5-13.3 4.2-17.2 4.2h-100c-16.8 0-30.2-3.1-36.7-4.9-3.9-1.1-12.1-3.6-15-6.5zm1.7-1.8zm.1-.2c2.1 2.6 22.2 10.7 49.9 10.7h100c3.5 0 10.3-1.7 16.2-4 8.1-3.2 10.3-5.8 10.3-6.7 0-.9-2.2-3.5-10.3-6.7-5.9-2.3-12.7-4-16.2-4h-100c-27.7 0-47.8 8.1-49.9 10.7zm-.1-.2"></path>
                </g>
                <path class="st5"
                      d="M240.8 125H106c0 1.1-.5 3.1-3.7 3.9-1.7.4-4.5.6-8.9.6-5.8 0-13.7-.2-20.6-.4 8.2 1 14.5 2.6 16.7 4.4 7.2 1.3 15.5 2.2 24.8 2.2h100c3.5 0 10.3-1.7 16.2-4 8.1-3.2 10.3-5.8 10.3-6.7z"></path>
                <path class="st1"
                      d="M229.8 133.4c2.4-2.5 3.7-5.4 3.7-8.4 0-3.2-1.4-6.1-3.6-8.4-.6-.2-1.1-.4-1.7-.6 2.7 2.3 4.6 5.5 4.6 9 0 3.3-1.7 6.5-4.7 9 .5-.2 1.1-.4 1.7-.6z"></path>
                <g>
                    <path class="st0"
                          d="M218.5 125.7c-.1 1-.4 1.9-.9 2.8l2.5 1.4c1.2-1.2 1.9-2.6 2.1-4.2h-3.7zM218.5 124.2h3.7c-.2-1.6-1-3.1-2.1-4.2l-2.5 1.4c.4.9.8 1.8.9 2.8zM216.7 120.2l2.1-1.2c-1.6-1.1-3.7-1.8-6-1.8h-1.6c2.2.4 4.2 1.5 5.5 3zM216.7 129.8c-1.3 1.5-3.2 2.6-5.5 3h1.6c2.3 0 4.4-.7 6-1.8l-2.1-1.2z"></path>
                </g>
                <g>
                    <path class="st2"
                          d="M67.6 128.5l-9.3 29.2H67s15-16.9 16.7-18.8c1.7-1.9 5-4.1 6.6-4 .4-2.7-9.6-5.4-22.7-6.4z"></path>
                    <g class="st6">
                        <path class="st0"
                              d="M67.6 128.5l-9.3 29.2H67s15-16.9 16.7-18.8c1.7-1.9 5-4.1 6.6-4 .4-2.7-9.6-5.4-22.7-6.4z"></path>
                    </g>
                    <path class="st3"
                          d="M65.5 135.2h23.7c.4-.1.8-.2 1.2-.2.2-1.4-2.2-2.7-6.3-3.9H66.9l-1.4 4.1zM83.3 139.4c.2-.2.3-.4.4-.5.8-.9 2.1-2 3.3-2.7H65.1l-1 3.2h19.2zM79.5 143.7c.8-.9 1.5-1.7 2.1-2.4H63.5l-.8 2.4h16.8zM75.7 148c.5-.5.9-1 1.4-1.5H62l-.5 1.5h14.2zM71.9 152.3c.2-.2.4-.5.6-.7H60.3l-.2.7h11.8z"></path>
                    <path class="st1"
                          d="M85.1 134.3c-1.4 1-2.7 2.1-3.4 2.9-1.5 1.6-12.7 14.3-15.9 17.9H62l7.5-23.6c7.3.6 12.5 1.7 15.6 2.8zm4.6-.6c-2.3-2.3-11.1-4.3-22.1-5.2l-9.3 29.2H67s15-16.9 16.7-18.8c1.7-1.9 5-4.1 6.6-4 .1-.4-.1-.8-.6-1.2z"></path>
                    <path class="st1"
                          d="M71.4 134.6l-7.8 15.1h-1.3l5.3-16.5 3.8 1.4zm1.9-.7l-6.6-2.5-6.3 19.6h4l8.9-17.1z"></path>
                </g>
                <g>
                    <path class="st2"
                          d="M67.6 121.5l-9.3-29.2H67s15 16.9 16.7 18.8c1.7 1.9 5 4.1 6.6 4 .4 2.7-9.6 5.4-22.7 6.4z"></path>
                    <path class="st3"
                          d="M60 97.7l.2.7h12.2c-.2-.2-.4-.5-.6-.7H60zM76.9 103.5c-.4-.4-.8-.9-1.2-1.4H61.4l.4 1.4h15.1zM81.4 108.5c-.5-.6-1.2-1.3-1.8-2H62.8l.7 2h17.9zM86.6 113.5c-1.1-.7-2.2-1.6-2.9-2.5l-.2-.2H64.2l.9 2.7h21.5zM85.2 118.6c3.3-1 5.2-2.2 5.1-3.4H65.6l1.1 3.4h18.5z"></path>
                    <path class="st1"
                          d="M65.8 95c3.2 3.6 14.4 16.2 15.9 17.9.2.2.3.4.5.5.7.7 1.7 1.5 2.9 2.3-2.9 1-7.9 2.2-15.5 2.9L62 95h3.8zm24.5 20c-1.5.1-4.4-1.8-6.2-3.6l-.4-.4C82 109.2 67 92.3 67 92.3h-8.7l9.3 29.2c13.1-1 23.1-3.7 22.7-6.5z"></path>
                    <path class="st1"
                          d="M63.6 100.3l7.8 15.1-3.8 1.5-5.3-16.5 1.3-.1zm.8-1.4h-4l6.3 19.7 6.6-2.5-8.9-17.2z"></path>
                </g>
                <g>
                    <path class="st0"
                          d="M145.8 135c-.1-.1-.1-.2-.2-.3-.1-.1-.1-.2-.2-.3 0-.1-.1-.2-.1-.3v-.3-.3c0-.1.1-.2.1-.3 0-.1.1-.2.2-.3.1-.1.1-.2.2-.3.1-.1.2-.1.3-.2.1-.1.2-.1.3-.2.1 0 .2-.1.3-.1h.6c.1 0 .2.1.3.1.1 0 .2.1.3.2.2.1.3.3.5.5.1.1.1.2.2.3 0 .1.1.2.1.3v.3c0 .4-.2.9-.5 1.2-.3.3-.8.5-1.2.5h-.3c-.1 0-.2-.1-.3-.1-.1 0-.2-.1-.3-.2-.1-.1-.2-.1-.3-.2zm-28.8 0c.3.3.7.5 1.2.5.9 0 1.7-.8 1.7-1.7 0-.9-.8-1.7-1.7-1.7-.9 0-1.7.8-1.7 1.7 0 .5.2.9.5 1.2zm4.8 0c.3.3.7.5 1.2.5.9 0 1.7-.8 1.7-1.7 0-.9-.8-1.7-1.7-1.7-.9 0-1.7.8-1.7 1.7 0 .5.2.9.5 1.2zm4.8 0c.3.3.7.5 1.2.5.9 0 1.7-.8 1.7-1.7 0-.9-.8-1.7-1.7-1.7-.9 0-1.7.8-1.7 1.7 0 .5.2.9.5 1.2zm4.8 0c.3.3.7.5 1.2.5.9 0 1.7-.8 1.7-1.7 0-.9-.8-1.7-1.7-1.7-.9 0-1.7.8-1.7 1.7 0 .5.2.9.5 1.2zm4.8 0c.3.3.7.5 1.2.5.9 0 1.7-.8 1.7-1.7 0-.9-.8-1.7-1.7-1.7-.9 0-1.7.8-1.7 1.7 0 .5.2.9.5 1.2zm4.8 0c.3.3.7.5 1.2.5.9 0 1.7-.8 1.7-1.7 0-.9-.8-1.7-1.7-1.7-.9 0-1.7.8-1.7 1.7 0 .5.2.9.5 1.2zm-27.6.5c.4 0 .9-.2 1.2-.5.3-.3.5-.8.5-1.2 0-.9-.8-1.7-1.7-1.7-.4 0-.9.2-1.2.5-.3.3-.5.8-.5 1.2 0 .4.2.9.5 1.2.4.3.8.5 1.2.5zM195.5 135c-.1-.1-.1-.2-.2-.3-.1-.1-.1-.2-.2-.3 0-.1-.1-.2-.1-.3v-.3c0-.4.2-.9.5-1.2.1-.1.2-.1.3-.2.1-.1.2-.1.3-.2.1 0 .2-.1.3-.1h.3c.6 0 1.1.3 1.4.8.1.1.1.2.2.3 0 .1.1.2.1.3v.6c0 .1 0 .2-.1.3 0 .1-.1.2-.2.3-.1.1-.1.2-.2.3-.3.3-.8.5-1.2.5h-.3c-.1 0-.2-.1-.3-.1-.1 0-.2-.1-.3-.2-.2-.1-.3-.1-.3-.2zm-28.8 0c.3.3.7.5 1.2.5.9 0 1.7-.8 1.7-1.7 0-.9-.8-1.7-1.7-1.7-.9 0-1.7.8-1.7 1.7 0 .5.2.9.5 1.2zm4.8 0c.3.3.7.5 1.2.5.9 0 1.7-.8 1.7-1.7 0-.9-.8-1.7-1.7-1.7-.9 0-1.7.8-1.7 1.7 0 .5.2.9.5 1.2zm4.8 0c.3.3.7.5 1.2.5.9 0 1.7-.8 1.7-1.7 0-.9-.8-1.7-1.7-1.7-.9 0-1.7.8-1.7 1.7 0 .5.2.9.5 1.2zm4.8 0c.3.3.7.5 1.2.5.9 0 1.7-.8 1.7-1.7 0-.9-.8-1.7-1.7-1.7-.9 0-1.7.8-1.7 1.7 0 .5.2.9.5 1.2zm4.8 0c.3.3.7.5 1.2.5.9 0 1.7-.8 1.7-1.7 0-.9-.8-1.7-1.7-1.7-.9 0-1.7.8-1.7 1.7 0 .5.1.9.5 1.2zm4.8 0c.3.3.7.5 1.2.5.9 0 1.7-.8 1.7-1.7 0-.9-.8-1.7-1.7-1.7-.9 0-1.7.8-1.7 1.7 0 .5.1.9.5 1.2zm-27.6.5h.3c.1 0 .2-.1.3-.1.1 0 .2-.1.3-.2.1-.1.2-.1.3-.2.1-.1.1-.2.2-.3.1-.1.1-.2.2-.3 0-.1.1-.2.1-.3v-.3-.3c0-.1-.1-.2-.1-.3 0-.1-.1-.2-.2-.3-.1-.2-.3-.3-.5-.5-.1-.1-.2-.1-.3-.2-.1 0-.2-.1-.3-.1h-.3c-.5 0-.9.2-1.2.5-.3.3-.5.8-.5 1.2 0 .4.2.9.5 1.2.3.3.7.5 1.2.5zM145.8 117.4c-.1-.1-.1-.2-.2-.3-.1-.1-.1-.2-.2-.3 0-.1-.1-.2-.1-.3v-.3c0-.4.2-.9.5-1.2.1-.1.2-.1.3-.2.1-.1.2-.1.3-.2.1 0 .2-.1.3-.1h.6c.1 0 .2.1.3.1.1 0 .2.1.3.2.5.3.8.9.8 1.4v.3c0 .1 0 .2-.1.3 0 .1-.1.2-.2.3-.1.1-.1.2-.2.3-.3.3-.8.5-1.2.5-.4 0-.8-.2-1.2-.5zm-28.7 0c.3.3.7.5 1.2.5.9 0 1.7-.8 1.7-1.7 0-.9-.8-1.7-1.7-1.7-.9 0-1.7.8-1.7 1.7 0 .4.1.9.5 1.2zm4.8 0c.3.3.7.5 1.2.5.9 0 1.7-.8 1.7-1.7 0-.9-.8-1.7-1.7-1.7-.9 0-1.7.8-1.7 1.7 0 .4.1.9.5 1.2zm4.7 0c.3.3.7.5 1.2.5.9 0 1.7-.8 1.7-1.7 0-.9-.8-1.7-1.7-1.7-.9 0-1.7.8-1.7 1.7.1.4.2.9.5 1.2zm4.8 0c.3.3.7.5 1.2.5.9 0 1.7-.8 1.7-1.7 0-.9-.8-1.7-1.7-1.7-.9 0-1.7.8-1.7 1.7 0 .4.2.9.5 1.2zm4.8 0c.3.3.7.5 1.2.5.9 0 1.7-.8 1.7-1.7 0-.9-.8-1.7-1.7-1.7-.9 0-1.7.8-1.7 1.7 0 .4.2.9.5 1.2zm4.8 0c.3.3.7.5 1.2.5.9 0 1.7-.8 1.7-1.7 0-.9-.8-1.7-1.7-1.7-.9 0-1.7.8-1.7 1.7 0 .4.2.9.5 1.2zm-27.5.5c.4 0 .9-.2 1.2-.5.1-.1.2-.2.2-.3.1-.1.1-.2.2-.3 0-.1.1-.2.1-.3v-.3c0-.9-.8-1.7-1.7-1.7h-.3c-.1 0-.2.1-.3.1-.1 0-.2.1-.3.2-.1.1-.2.1-.3.2-.3.3-.5.8-.5 1.2 0 .4.2.9.5 1.2.3.3.7.5 1.2.5zM195.5 117.4c-.1-.1-.1-.2-.2-.3-.1-.1-.1-.2-.2-.3 0-.1-.1-.2-.1-.3v-.3-.3c0-.1.1-.2.1-.3 0-.1.1-.2.2-.3.1-.1.1-.2.2-.3.1-.1.2-.1.3-.2.1-.1.2-.1.3-.2.1 0 .2-.1.3-.1h.6c.1 0 .2.1.3.1.1 0 .2.1.3.2.2.1.3.3.5.5.1.1.1.2.2.3 0 .1.1.2.1.3v.6c0 .1-.1.2-.1.3 0 .1-.1.2-.2.3-.1.1-.1.2-.2.3-.1.1-.2.1-.3.2-.1.1-.2.1-.3.2-.1 0-.2.1-.3.1h-.6c-.1 0-.2-.1-.3-.1-.1 0-.2-.1-.3-.2-.2-.1-.3-.2-.3-.2zm-28.8 0c.3.3.7.5 1.2.5.9 0 1.7-.8 1.7-1.7 0-.9-.8-1.7-1.7-1.7-.9 0-1.7.8-1.7 1.7 0 .4.2.9.5 1.2zm4.8 0c.3.3.7.5 1.2.5.9 0 1.7-.8 1.7-1.7 0-.9-.8-1.7-1.7-1.7-.9 0-1.7.8-1.7 1.7 0 .4.2.9.5 1.2zm4.8 0c.3.3.7.5 1.2.5.9 0 1.7-.8 1.7-1.7 0-.9-.8-1.7-1.7-1.7-.9 0-1.7.8-1.7 1.7 0 .4.2.9.5 1.2zm4.8 0c.3.3.7.5 1.2.5.9 0 1.7-.8 1.7-1.7 0-.9-.8-1.7-1.7-1.7-.9 0-1.7.8-1.7 1.7 0 .4.2.9.5 1.2zm4.8 0c.3.3.7.5 1.2.5.9 0 1.7-.8 1.7-1.7 0-.9-.8-1.7-1.7-1.7-.9 0-1.7.8-1.7 1.7 0 .4.2.9.5 1.2zm4.8 0c.3.3.7.5 1.2.5.9 0 1.7-.8 1.7-1.7 0-.9-.8-1.7-1.7-1.7-.9 0-1.7.8-1.7 1.7 0 .4.2.9.5 1.2zm-28.6.2c.1.1.2.1.3.2.1 0 .2.1.3.1h.6c.1 0 .2-.1.3-.1.1 0 .2-.1.3-.2.1-.1.2-.1.3-.2.1-.1.1-.2.2-.3.1-.1.1-.2.2-.3 0-.1.1-.2.1-.3v-.3-.3c0-.1-.1-.2-.1-.3 0-.1-.1-.2-.2-.3-.1-.2-.3-.3-.5-.5-.1-.1-.2-.1-.3-.2-.1 0-.2-.1-.3-.1h-.3c-.4 0-.9.2-1.2.5-.1.1-.1.2-.2.3-.1.1-.1.2-.2.3 0 .1-.1.2-.1.3v.3c0 .4.2.9.5 1.2.2 0 .2.1.3.2z"></path>
                </g>
                <g>
                    <path class="st2"
                          d="M103.3 125c0 .9-1 1.7-9.9 1.7-13 0-37-.8-37-1.7 0-.9 24-1.7 37-1.7 8.9 0 9.9.8 9.9 1.7z"></path>
                    <path class="st7" d="M56.4 125c0 .9 24 1.7 37 1.7 8.9 0 9.9-.8 9.9-1.7H56.4z"></path>
                    <path class="st1"
                          d="M103.1 124.4c.2.2.2.4.2.6 0 .9-1 1.7-9.9 1.7-12.7 0-36-.7-37-1.6v-.1c0-.9 24-1.7 37-1.7 6.9 0 9 .5 9.7 1.1zm1.9-1.9c-1.3-1.3-3.3-1.9-11.6-1.9-6.7 0-15.9.2-23.5.5-4.1.2-7.4.3-9.8.5-1.4.1-2.4.2-3.1.3-2.2.4-3.3 1.4-3.3 3 0 .7.3 1.4.8 2 .9.9 1.4 1.4 15.9 2 7.4.3 16.5.5 23 .5 4.4 0 7.2-.2 8.9-.6 3.2-.7 3.7-2.7 3.7-3.9 0-1.1-.5-2-1-2.4z"></path>
                </g>
            </g>
        </svg>
        <style>
            .airplane_line_1, .airplane_line_2, .airplane_line_3, .airplane_line_4, .airplane_line_5, .airplane_line_6, .airplane_line_7, .airplane_line_8 {
                display: block
            }

            @keyframes airplane_line_1_animation {
                0%, to {
                    opacity: 1;
                    transform: translateX(0);
                    -moz-transform: translateX(0);
                    -webkit-transform: translateX(0)
                }
                10.06711%, 19.46309%, 43.62416%, 53.02013%, 78.52349%, 87.91946% {
                    opacity: 1
                }
                18.12081%, 51.67785%, 86.57718% {
                    opacity: 0;
                    transform: translateX(-20px);
                    -moz-transform: translateX(-20px);
                    -webkit-transform: translateX(-20px)
                }
                18.79195%, 52.34899%, 87.24832% {
                    opacity: 0;
                    transform: translateX(0);
                    -moz-transform: translateX(0);
                    -webkit-transform: translateX(0)
                }
            }

            body .airplane_line_1 {
                animation-name: airplane_line_1_animation
            }

            body .airplane_line_1, body .airplane_line_2, body .airplane_line_3 {
                animation-duration: 6.20833s;
                animation-fill-mode: forwards;
                animation-iteration-count: infinite;
                animation-timing-function: ease-out
            }

            @keyframes airplane_line_2_animation {
                0%, to {
                    opacity: 1;
                    transform: translateX(0);
                    -moz-transform: translateX(0);
                    -webkit-transform: translateX(0)
                }
                26.84564%, 34.22819%, 54.36242%, 61.74497%, 86.57718%, 93.95973% {
                    opacity: 1
                }
                32.88591%, 60.40268%, 92.61745% {
                    opacity: 0;
                    transform: translateX(-20px);
                    -moz-transform: translateX(-20px);
                    -webkit-transform: translateX(-20px)
                }
                33.55705%, 61.07383%, 93.28859% {
                    opacity: 0;
                    transform: translateX(0);
                    -moz-transform: translateX(0);
                    -webkit-transform: translateX(0)
                }
            }

            body .airplane_line_2 {
                animation-name: airplane_line_2_animation
            }

            @keyframes airplane_line_3_animation {
                0%, to {
                    opacity: 1;
                    transform: translateX(0);
                    -moz-transform: translateX(0);
                    -webkit-transform: translateX(0)
                }
                14.7651%, 21.47651%, 48.32215%, 55.03356%, 81.87919%, 88.5906% {
                    opacity: 1
                }
                20.13423%, 53.69128%, 87.24832% {
                    opacity: 0;
                    transform: translateX(-20px);
                    -moz-transform: translateX(-20px);
                    -webkit-transform: translateX(-20px)
                }
                20.80537%, 54.36242%, 87.91946% {
                    opacity: 0;
                    transform: translateX(0);
                    -moz-transform: translateX(0);
                    -webkit-transform: translateX(0)
                }
            }

            body .airplane_line_3 {
                animation-name: airplane_line_3_animation
            }

            @keyframes airplane_line_4_animation {
                0%, to {
                    opacity: 1;
                    transform: translateX(0);
                    -moz-transform: translateX(0);
                    -webkit-transform: translateX(0)
                }
                24.16107%, 32.21477%, 56.37584%, 64.42953%, 91.94631% {
                    opacity: 1
                }
                30.87248%, 63.08725%, 98.65772% {
                    opacity: 0;
                    transform: translateX(-20px);
                    -moz-transform: translateX(-20px);
                    -webkit-transform: translateX(-20px)
                }
                31.54362%, 63.75839%, 99.32886% {
                    opacity: 0;
                    transform: translateX(0);
                    -moz-transform: translateX(0);
                    -webkit-transform: translateX(0)
                }
            }

            body .airplane_line_4 {
                animation-name: airplane_line_4_animation
            }

            body .airplane_line_4, body .airplane_line_5, body .airplane_line_6, body .airplane_line_7, body .airplane_line_8, body .airplane_wrapper {
                animation-duration: 6.20833s;
                animation-fill-mode: forwards;
                animation-iteration-count: infinite;
                animation-timing-function: ease-out
            }

            @keyframes airplane_line_5_animation {
                0%, to {
                    opacity: 1;
                    transform: translateX(0);
                    -moz-transform: translateX(0);
                    -webkit-transform: translateX(0)
                }
                16.10738%, 22.81879%, 49.66443%, 56.37584%, 82.55034%, 89.26174% {
                    opacity: 1
                }
                21.47651%, 55.03356%, 87.91946% {
                    opacity: 0;
                    transform: translateX(-20px);
                    -moz-transform: translateX(-20px);
                    -webkit-transform: translateX(-20px)
                }
                22.14765%, 55.7047%, 88.5906% {
                    opacity: 0;
                    transform: translateX(0);
                    -moz-transform: translateX(0);
                    -webkit-transform: translateX(0)
                }
            }

            body .airplane_line_5 {
                animation-name: airplane_line_5_animation
            }

            @keyframes airplane_line_6_animation {
                0%, to {
                    opacity: 1;
                    transform: translateX(0);
                    -moz-transform: translateX(0);
                    -webkit-transform: translateX(0)
                }
                24.83221%, 31.54362%, 74.49664%, 81.20805%, 93.28859% {
                    opacity: 1
                }
                30.20134%, 79.86577%, 98.65772% {
                    opacity: 0;
                    transform: translateX(-20px);
                    -moz-transform: translateX(-20px);
                    -webkit-transform: translateX(-20px)
                }
                30.87248%, 80.53691%, 99.32886% {
                    opacity: 0;
                    transform: translateX(0);
                    -moz-transform: translateX(0);
                    -webkit-transform: translateX(0)
                }
            }

            body .airplane_line_6 {
                animation-name: airplane_line_6_animation
            }

            body .airplane_line_7 {
                animation-name: airplane_line_5_animation
            }

            @keyframes airplane_line_8_animation {
                0%, to {
                    opacity: 1;
                    transform: translateX(0);
                    -moz-transform: translateX(0);
                    -webkit-transform: translateX(0)
                }
                21.47651%, 28.18792%, 48.32215%, 55.03356%, 93.28859% {
                    opacity: 1
                }
                26.84564%, 53.69128%, 98.65772% {
                    opacity: 0;
                    transform: translateX(-20px);
                    -moz-transform: translateX(-20px);
                    -webkit-transform: translateX(-20px)
                }
                27.51678%, 54.36242%, 99.32886% {
                    opacity: 0;
                    transform: translateX(0);
                    -moz-transform: translateX(0);
                    -webkit-transform: translateX(0)
                }
            }

            body .airplane_line_8 {
                animation-name: airplane_line_8_animation
            }

            @keyframes main_wrapper_animation {
                0%, 50.33557%, to {
                    transform: scale(1);
                    -moz-transform: scale(1);
                    -webkit-transform: scale(1)
                }
                24.83221%, 75.83893% {
                    transform: scale(.8);
                    -moz-transform: scale(.8);
                    -webkit-transform: scale(.8)
                }
            }

            .airplane_wrapper {
                transform-origin: 125px 125px
            }

            body .airplane_wrapper {
                animation-name: main_wrapper_animation
            }

            #preloader.preloader {
                font-family: Open Sans, Helvetica Neue, Arial, sans-serif;
                top: 0;
                left: 0;
                background: #fff;
                width: 100%;
                height: 100%;
                position: fixed;
                display: -ms-flexbox;
                display: flex;
                -ms-flex-pack: center;
                justify-content: center;
                -ms-flex-align: center;
                align-items: center;
                z-index: 1000;
                -ms-flex-direction: column;
                flex-direction: column
            }

            #preloader.preloader--hidden {
                display: none
            }

            #preloader.preloader h1 {
                font-size: 28px;
                color: #2d2d2d;
                margin: 0 0 40px;
                padding: 0 10px;
                text-align: center;
                font-weight: 400
            }

            #preloader.preloader svg {
                width: 150px;
                margin-bottom: 20px
            }

            @media screen and (max-width: 720px) {
                #preloader.preloader h1 {
                    font-size: 20px
                }
            }
        </style>
        <div class="preloader-overlay__text">
            ${translate('titles.wait_loading')}
        </div>
    </div>
</div>`;

export default index_template;
