/**
 * Created by Mac on 30/06/16.
 */
angular.module('integracionInsiteApp').service('$ajax', function ($http) {
  var components = {
    params: null,
    loading: null,
    save: false,
    setLoading: function () {
      switch (typeof this.params.loading) {
        case undefined:
          this.params.loading = false
          break;
        case 'string':
          this.params.loading = this.params.loading == 'true' ? true : false
          break;
        case 'boolean':
          break;
        default:
          this.params.loading = false;
          break;
      }
      if (this.params.loading || this.save) {
        //this.loading = bootbox.alert("Cargando");
      }
    },
    setRequestType: function () {
      this.params.request_type = typeof this.params.request_type === undefined ? 'normal' : this.params.request_type;
      var $request;
      if (this.params.request_type == 'file' || this.params.request_type == 'multipart/form-data') {
        //convierto los datos en un objeto FormData()
        var $new_data = new FormData();
        for (var $key in this.params.data) {

          if (typeof this.params.data[$key] !== 'function' && !Array.isArray(this.params.data[$key])) {
            $new_data.append($key, this.params.data[$key]);
          } else if (Array.isArray(this.params.data[$key])) {
            $new_data.append($key, JSON.stringify(this.params.data[$key]));
          }
        }
        //hago el request y cambio los parametros para que el contet type sea multipart/form-data (undefined es multipart)
        $request = $http.post(base_url + this.params.url, $new_data, {
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined}
        });
        //fin del codigo para multipart/form-data
      }
      else {
        $request = $http.post(base_url + this.params.url, this.params.data);
      }
      return $request;
    },
    succes: function ($data) {
      if (this.params.loading) {
        $('body').css('cursor', 'auto');
        this.loading.close();
      }
      //codigo para redireccionar y dr un modal de espera mientras se completa
      if (this.params.redirect_url !== undefined) {
        //BootstrapDialog.show({
        //    type: 'type-success',
        //    title: 'Exito !',
        //    closable: false,
        //    message: 'El guardado fue un exito, espere mientras se redirecciona'
        //});
        window.location.replace(base_url + this.params.redirect_url);
      }
    },
    error: function ($data) {
      if (this.params.loading) {
        this.loading.close();
      }
      var $info = {};
      if ($data !== null && typeof $data == 'object') {
        $info.title = 'Please check the required data in the form:'
        $info.message = "<ul>";
        for (var $property in $data) {
          if ($data.hasOwnProperty($property)) {
            $info.message += ('<li>' + $data[$property] + '</li>');
          }
        }
        $info.message += ('</ul>');
      } else if (navigator.onLine) {
        if (this.save) {
          $info = {
            title: 'Error al intentar contactar al servidor',
            message: 'Hubo un error al intentar contactar al servidor: <br> 1) Cierre este dialogo e intente guardar de nuevo. <br> 2) Llame a servicio tecnico si el error se repite.'
          };
        } else {
          $info = {
            title: 'Error al intentar contactar al servidor',
            message: 'Hubo un error al intentar contactar al servidor, recarge la pagina y si el error continua, llame a servicio tecnico.'
          };
        }
      } else {
        if (this.save) {
          $info = {
            title: 'Problema con su conexion a internet',
            message: 'Parece que su conexion a internet fallo: <br> 1) Cierre este dialogo y revise su conexion a internet. <br> 2) intente guardar de nuevo una vez confrme que la conexion a internet no esta fallando. <br> 3) Llame a servicio tecnico si el error se repite aun cuando su conexion ainternet no tiene probmas.'
          };
        } else {
          $info = {
            title: 'Problema con su conexion a internet',
            message: 'Parece que su conexion a internet fallo, recargue esta pagina por favor, si el problema perciste llame a servicio tecnico.'
          };
        }
      }
      //BootstrapDialog.show({
      //    type: 'type-warning',
      //    title: $info.title,
      //    message: $info.message
      //});
    }
  };
  this.get = function ($params) {
    components.params = $params;
    components.setLoading();
    $http.get(base_url + $params.url)
      .success(function ($data) {
        components.succes($data);
        $params.succes($data);
      })
      .error(function ($data) {
        components.error($data);
      });
  };
  this.post = function ($params) {
    components.params = $params;
    components.setLoading();
    var $request = components.setRequestType();
    $request.success(function ($data) {
      components.succes($data);
      $params.succes($data);
    }).error(function ($data) {
      components.error($data);
    });
  };
  this.save = function ($params) {
    components.save = true;
    components.params = $params;
    components.setLoading();
    $params.data.token = variables.csrf_token;
    var $request = components.setRequestType();
    $request.success(function ($data) {
      components.succes($data);
      $params.succes($data);
    }).error(function ($data) {
      components.error($data);
    });
  };

})
  .directive('fileModel', ['$parse', function ($parse) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var model = $parse(attrs.fileModel);
        var modelSetter = model.assign;

        element.bind('change', function () {
          scope.$apply(function () {
            modelSetter(scope, element[0].files[0]);
          });
        });
      }
    };
  }])
