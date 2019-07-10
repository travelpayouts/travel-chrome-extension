# Travelpayouts Google Chrome Extension

С помощью данного расширения для Chrome, пользователь получает стартовый экран для новых страниц. На экране содержится информация о стоимости перелёта из города пользователя в другой город. При каждом открытии новой вкладки город меняется.

![Alt text](https://monosnap.com/image/rJ1RvaXD4Psnj6mzPfMApFCzrDhmPB)

## Конфигурация расширения

В файле config.js партнёр может настроить расширение под себя:

 - marker — партнёрский маркер;
 - host — адрес сайта, на котором будет выполняться поиск. Замените на адрес своего White Label или оставьте без изменений, чтобы результат поиска открывался на aviasales.ru. Формат ввода адреса: адрес_вашего_white_label/flights — без http://;
 - host_logo — ссылка на ваш White Label;
 - rss — ссылка на RSS ленту вашего сайта. Если меняете ссылку на RSS ленту, то нужно будет изменить домен (параметр storage) в файле manifest.json.
 
## Как работает расширение

Информация о работе расширения находится в файле [документации](https://github.com/travelpayouts/travel-chrome-extension/blob/master/read).

Для пользователя работа расширения выглядит так: https://monosnap.com/image/zxnGGk3FD7OMsq4IDbT1TA0aJzpOV6

## Сборка расширения

Чтобы собрать расширение после редактирования кода, используйте команды:

`npm install`

`npm run build`
