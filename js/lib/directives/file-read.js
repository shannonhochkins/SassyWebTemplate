/*

// First of all, Watch the FILES object in the scope.
$scope.$watch('files', function () {
    $scope.methods.upload($scope.files);
});

// Handle the upload
$scope.upload = function (files) {
    if (files && files.length) {
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var uploadingFile = $('.fileList.' +  $scope.file_came_from + ' .file').last();
            var filename = uploadingFile.find('.filename');
            Upload.upload({
                method : 'POST', 
                url: '/pathtoupload?action=fileUpload',
                fields : {
                    'competition_id' : $scope.formData.competition_id,
                    'file_description' : $scope.file_came_from
                },
                file: file
            }).progress(function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                filename.find('.percentage').html('Uploading - ' + progressPercentage + '%');
            }).success(function (data, status, headers, config) {
                filename.find('.percentage').html(' - Uploaded Successfully.');
                uploadingFile.addClass('success');
                uploadingFile.find('button.action').prop('disabled',false);
                uploadingFile.scope().imageID = data.content.$id;
            }).error(function (data, status, headers, config) {
                filename.find('.percentage').html(' - Unsupported File Type.');
            })
        }
    }
}


Then in HTML

<input type="file" id="proof_of_purchase" name="proof_of_purchase" destination="proofOfPurchase" filereader="formData.proofOfPurchase" ngf-select ngf-change="upload($files)" class="">


*/

app.directive("filereader", ['$compile', '$http', function ($compile, $http) {
    return {
        scope: {
            filereader: "=",
            destination: "@",
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                scope.$apply(function () {
                    if (angular.isUndefined(scope.filereader)) scope.filereader = [];
                    var file = {
                        filename : element.val(),
                    }
                    scope.filereader.push(file);
                    scope.$parent.file_came_from = scope.destination;
                    if (angular.element('.' + scope.destination).length) {
                        var t = '<div class="file">';
                            t += '<small class="filename floatLeft small">'+file.filename+'<div class="inline percentage"></div></small>';
                            t += '<button type="button" class="action fa fa-trash" ng-click="$parent.methods.removeFile(this, \''+scope.destination+'\');" disabled></button>';
                        t += '</div>';
                        var el = angular.element(t);
                        angular.element('.' + scope.destination).append(el);
                        scope.element = el;
                        var result = $compile(el)(scope);
                    }
                });

            });
            
        }
    }
}]);
