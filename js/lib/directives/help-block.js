
/*

    Usage: 

    Will toggle the display of a 'required' box next to any element, quick way to control multiple validation errors.

 <form ng-submit="methods.submit(formData)" ng-controller="diamondController" name="myForm" novalidate >
     <label for="firstName">First Name<help-block field="myForm.firstName"></help-block></label>
     <input type="text" placeholder="" value="" id="firstName" name="firstName" ng-model="formData.firstName" class="" required>

     // You can also append data-slim="true" to the element to change the template type.
 </form>


*/


app.directive('helpBlock', ['$compile', function($compile) {
    return {
        scope : {
            field : '=',
            slim : '='
        },
        restrict : 'E',
        replace: true,
        template : '<div class="helper inline"><div ng-show="field.$invalid  && field.$touched" class="help-block"> * <div ng-show="slim !== true" class="inline">{{field.$name | niceLabel}} is </div>required.</div></div>',
        link : function(scope, element, attrs, formCtrl) {
            
        }
    }
}]);
