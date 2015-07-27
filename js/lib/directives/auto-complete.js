
/*

    Usage: 
    <input type="text" data-auto-complete data-url="/path/to/json" ng-model="selectedValueFromAutocomplete" />

    Selected: {{ selectedValueFromAutocomplete }}

*/

app.directive('autoComplete', ['$http', function($http) {
	return {
		restrict : 'A', 
		scope : {
			url : '@',
			ngModel: '='
		},
		require : 'ngModel',
		link : function(scope, elem, ettrs, ngModel) {
			elem.autocomplete({
				source: function(req, response) {
					var regex = new RegExp(req.term, 'i');
					if(xhr) xhr.abort();
			        var xhr = $.ajax({
			          	url: scope.url,
			          	dataType: "json",
			          	cache: false,
			          	success: function(data) {
			            	response($.map(data, function(item) {
			              		if(regex.test(item.label)){
			                		return {
			                    		label: item.label + ', ' + item.code,
			                    		value: item.label + ', ' + item.code,
			                		};
			              		}
			            	}));
			          	}
			        });
				},
				minLength: 2,
				select : function(event, ui) {
					ngModel.$setViewValue(ui.item.value);
				}
			})
		}
	}
}]);

/*
    Usage: 
    <input type="text" data-google-place ng-model="location.address" />

    Address: {{ location.address }}
    City: {{ location.city }}
    State: {{ location.state }}
    Country: {{ location.country }}
    Postcode: {{ location.postcode }}

*/

app.directive('googleplace', [function(){
    return {
        link: function(scope, elm, attrs){
            var autocomplete = new google.maps.places.Autocomplete(elm[0], {});
            google.maps.event.addListener(autocomplete, 'place_changed', function() {
                var place = autocomplete.getPlace();
                var addressComponents = place.address_components;
                var found = {};
                addressComponents = addressComponents.filter(function(component){
                    switch (component.types[0]) {
                        case "locality": // city
                        	found.city = component.long_name;
                            return true;
                        case "administrative_area_level_1": // state
                        	found.state = component.long_name;
                            return true;
                        case "country": // country
                        	found.country = component.long_name;
                            return true;
                        case "postal_code":
                        	found.postcode = component.long_name;
                        default:
                            return false;
                    }
                })
                found.address = place.name;
                scope.$apply(function() {
                	angular.merge(scope.$parent.location, found);
                });
            });
        }
    }
}]);

