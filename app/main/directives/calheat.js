'use strict';

angular.module('main')
    .directive('calHeatmap', function (chmFactory) {
        function link (scope, el) {
            var config = scope.config;
            // var ider = scope.ider;
            var element = el[0];
            // var cal = new CalHeatMap();
            var cal = chmFactory;
            // cal.init(config);
            cal.init({
                itemSelector: config.itemSelector || element,
                domain: !config ? 'month' : config.domain ? config.domain : 'month',
                // subDomain: !config ? 'day' : config.subDomain ? config.subDomain : 'day',
                subDomain: config.subDomain || 'min',
                subDomainTextFormat: !config ? '%d' : config.subDomainTextFormat ? config.subDomainTextFormat : '%d',
                data: !config ? '' : config.data ? config.data : '',
                legend: config.legend,
                // considerMissingDataAsZero: true,
                start: !config ? new Date() : config.start ? config.start : new Date(),
                cellSize: !config ? 25 : config.cellSize ? config.cellSize : 25,
                // cellPadding: 5,
                range: !config ? 3 : config.range ? config.range : 3,
                domainGutter: !config ? 2 : config.domainGutter ? config.domainGutter : 20,
                // legend: !config ? [2, 4, 6, 8, 10] : config.legend ? config.legend : [2, 4, 6, 8, 10],
                itemName: !config ? 'item' : config.itemName ? config.itemName : 'item',
                colLimit: !config ? null : config.colLimit ? config.colLimit : null,
                verticalOrientation: !config ? false : config.verticalOrientation ? config.verticalOrientation : false,
                displayLegend: !config ? false : config.displayLegend ? config.displayLegend : false,
                highlight: 'now',
                label: config.label,
                onClick: config.onClick,
                afterLoadData: config.afterLoadData || null
              });
          }

        return {
            template: '<div  config="config" ></div>',
            restrict: 'E', // E (element vs A attribute selector)
            link: link,
            scope: { config: '=', ider: '=' }
          };
      });
