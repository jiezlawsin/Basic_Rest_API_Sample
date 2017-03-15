//===== ASSET MANAGER
(function(){
	var assetModal = $('#assets-modal');
	var assetForm = $('#file-upload-form');
	var fileDropzone = document.getElementById('file-dropzone');
	var fileDropzoneJquery = $('#file-dropzone');
	var fileLibrary = $('#file-library .files');
	var assetInput = assetModal.find('.input-file');
	var assetDetailForm = $('#asset-detail-form');
	var assetDetail = assetModal.find('.asset-details');
	var assetSelect = $('.sumo-asset-select');
	var assetSelected = {
		container: '',
		id: '',
		path: ''
	};
	var assetDisplay = $('.sumo-asset-display');
	var assetInitLoad = false;
	var assetLoadMoreBtn = assetModal.find('.btn-more');
	var loaderModal = $('.loader-asset');
	var loaderDetails = assetModal.find('.loader-detail');
	var photos, notify;

	//===== INITIALIZE MODAL AND ASSETS
	assetModal.on('shown.bs.modal', function () {
		if (!assetInitLoad) {
			getAssetList(0);
		}
	});
	assetModal.on('hidden.bs.modal', function () {
		fileLibrary.find('file').removeClass('active');
	});
	function getAssetList(count) {
		var url = fileLibrary.data('url');
		assetLoadMoreBtn.attr('disabled', 'disabled');
		$.ajax({
			type : 'GET',
			url: url,
			data : {
				'count': count
			},
			dataType: 'json',
			success : function(data) {
				assetInitLoad = true;
				fileLibrary.append(data.view);
				assetModal.find('.loader-asset').addClass('hide');
				assetModal.find('.row-asset').removeClass('hide');
				assetLoadMoreBtn.removeAttr('disabled');
				bindFiles();
				findActiveAsset();
				if (! data.next) {
					assetLoadMoreBtn.addClass('hide');
				}
			},
			error : function(data, text, error) {
				var count = fileLibrary.find('.file').length - 1;
				getAssetList(count);
				console.log(data);
				console.log(text);
				console.log(error);
			}
		});
	};
	function findActiveAsset() {
		fileLibrary.find('.file[data-id="' + assetSelected.id + '"]').addClass('active');
	}
	function bindFiles() {
		fileLibrary.find('.file').each(function() {
			var file = $(this);
			file.unbind();
			file.on('click', function() {
				var clicked = $(this);
				fileLibrary.find('.file').removeClass('active');
				if (! clicked.hasClass('active')) {
					loaderDetails.removeClass('hide');
					assetDetail.addClass('hide');
					clicked.addClass('active');
					var id = clicked.data('id');
					getAssetDetails(id);
				} else {
					$('.asset-details').addClass('hide');
					clicked.removeClass('active');
				}
			})
		})
	};
	function getAssetDetails(id) {
		var url = assetDetail.data('url');
		$.ajax({
			type : 'GET',
			url: url,
			data : {id: id},
			dataType : 'json',
			success : function(asset) {
				displayDetailsToForm(asset);
				loaderDetails.addClass('hide');
				assetDetail.removeClass('hide');
			},
			error : function(data, text, error) {

			}
		});
	}
	assetLoadMoreBtn.on('click', function() {
		// -1 because of clone file
		var count = fileLibrary.find('.file').length - 1;
		getAssetList(count);
	});

	//====== SELECTING ASSET
	assetModal.find('.btn-select').on('click', function() {
		displaySelectedAsset();
	});
	function displaySelectedAsset() {
		assetSelected.container.find('img').attr('src', assetSelected.path);
		assetSelected.container.find('.sumo-asset').val(assetSelected.id);
	};

	//====== DRAG AND DROP FUNCTIONS
	fileDropzoneJquery.on('click', function() {
		assetInput.click();
	});
	function addEventHandler(obj, evt, handler) {
		if(obj.addEventListener) {
			obj.addEventListener(evt, handler, false);
		} else if(obj.attachEvent) {
			obj.attachEvent('on'+evt, handler);
		} else {
			obj['on'+evt] = handler;
		}
	}
	addEventHandler(fileDropzone, 'drop', function(e) {
	  	e = e || window.event;
	  	if (e.preventDefault) { e.preventDefault(); }
	  	files = event.target.files;
	  	uploadFiles(e.dataTransfer.files);
  		return false;
	});
	addEventHandler(fileDropzone, 'dragenter', function(e) {
		e.preventDefault();
		// console.log('dragenter');
	});
	addEventHandler(fileDropzone, 'dragover', function(e) {
		e.preventDefault();
		// console.log('dragover');
	});

	//===== UPLOAD ASSETS
	assetInput.change(function(e) {
		files = event.target.files;
		uploadFiles(files);
	});
	function uploadFiles(files) {
		assetModal.find('a[href="#file-library"]').tab('show');
		var route = assetForm.attr('action');
		var request = [];
		var formdata = [];
		var types = [];
		var randomID;
		
		if (files && files[0]) {
			for (i = 0; i < files.length; i++) {
				if (files[i].type.match(/image.*/)) {
					types[i] = 'image';
				} else if (files[i].type.match(/video.*/)) {
					types[i] = 'video';
				} else if (files[i].type.match(/audio.*/)) {
					types[i] = 'audio';
				} else {
					types[i] = 'file';
				}

				// set max size (10mb)
				if (files[0].size <= 10240000) {
					request[i] = new XMLHttpRequest();
					formdata[i] = new FormData();
					
					randomID = 'asst_' + Math.floor(Math.random() * 1000000000000);
					formdata[i].append('photo', files[i]);
					formdata[i].append('type', types[i]);
					formdata[i].append('_token', assetForm.find('input[name="_token"]').val());
					request[i].open('post', route, true);
					
					processPhoto(request[i], types[i], randomID);
					request[i].send(formdata[i]);
				}
			}
		}
	}
	function processPhoto(request, type, id) {
		var asset = $('.'+id);
		fileLibrary.find('.clone').clone().appendTo(fileLibrary).removeClass('clone hide').addClass(id);
		request.upload.onprogress = function (e) {
			if (e.lengthComputable) {
				var ratio = Math.floor((e.loaded / e.total) * 100);
				$('.'+id).find('.progress').attr('aria-valuenow', ratio);
				$('.'+id).find('.progress-bar').width(ratio + '%');
			}
		}
		request.addEventListener('load', function(e) {
			console.log(type);
			var data = JSON.parse(request.responseText);
			$('.'+id).attr('data-id', data.id);
			$('.'+id).find('.progress').hide();
			$('.'+id).css({
				'background-image': 'url(' + data.filepath + ')'
			});
		}, false);
		bindFiles();
	}
	function displayDetailsToForm(asset) {
		assetSelected.id = asset.id;
		assetSelected.path = asset.absolute_path;
		assetDetailForm.find('.photo img').attr('src', asset.absolute_path);
		assetDetailForm.find('[name="id"]').val(asset.id);
		assetDetailForm.find('[name="name"]').val(asset.name);
		assetDetailForm.find('[name="caption"]').val(asset.caption);
		assetDetailForm.find('[name="alt"]').val(asset.alt);
	}
	assetDetailForm.submit(function(e) {
		e.preventDefault();
		var url = assetDetailForm.attr('action');
		$.ajax({
			type : 'POST',
			url: url,
			data : assetDetailForm.serialize(),
			dataType : 'json',
			success : function(data) {
				showNotify(data.notifTitle);
			},
			error : function(data, text, error) {
				showNotify('An error occurred.');
			}
		});
	});

	//====== DOWNLOAD FILE
	assetModal.find('.download-btn').on('click', function(e) {
		e.preventDefault();
		var id = assetDetailForm.find('[name="id"]').val();
		var url = $(this).find('a').attr('href');
		window.open(url+'?id='+id, '_blank');
	});

	//===== DELETE FUNCTIONS
	assetDetail.find('.delete-btn').on('click', function() {
		assetDetail.find('.delete-btn').addClass('hide');
		assetDetail.find('.confirm-btn').removeClass('hide');
	});
	assetDetail.find('.confirm-btn a').on('click', function(e) {
		e.preventDefault();
		resetDeleteBtns();
	});
	assetDetail.find('.confirm-btn .confirm-delete-btn').on('click', function(e) {
		var id = assetDetailForm.find('[name="id"]').val();
		var url = $(this).attr('href');
		$.ajax({
			type : 'POST',
			url: url,
			data : assetDetailForm.serialize(),
			dataType : 'json',
			success : function(asset) {
				fileLibrary.find('.file').removeClass('active');
				fileLibrary.find('.file[data-id="' + id + '"]').remove();
				assetDetail.addClass('hide');
			},
			error : function(data, text, error) {

			}
		});
	});
	function resetDeleteBtns() {
		assetDetail.find('.delete-btn').removeClass('hide');
		assetDetail.find('.confirm-btn').addClass('hide');
	}

	//===== INITIALIZE IMAGE SELECTOR FROM FORM
	assetSelectInit();
	function assetSelectInit() {
		assetSelect.each(function() {
			var asset = $(this);
			var assetInput = asset.find('.sumo-asset');
			asset.find('label').append('<a class="select" data-toggle="modal" data-target="#assets-modal" href="#">Select</a>');
			if (! _.isUndefined(assetInput.data('thumbnail')) && ! _.isUndefined(assetInput.data('id'))) {
				asset.find('label').append('<a class="crop" href="#">Crop</a>');
			}
			asset.find('label').append('<a class="remove" href="#">Remove</a>');
			asset.append('<img src="">');
			asset.append('<div class="loader loader-asset"><div class="spinner"></div></div>');
			checkSelectedAsset(asset);
		});
		bindSelectBtns();
	}
	function bindSelectBtns() {
		assetSelect.find('.select').on('click', function(e) {
			e.preventDefault();
			var btn = $(this);
			assetSelected.container = btn.closest('.sumo-asset-select');
			assetSelected.id = assetSelected.container.find('.sumo-asset').val();
			getAssetDetails(assetSelected.id);
			findActiveAsset();
		});
		assetSelect.find('.crop').on('click', function(e) {
			e.preventDefault();
			hideLoader(false);
			showNotify('Retrieving URL.');

			var btn = $(this);
			var input = btn.closest('.sumo-asset-select').find('input');
			assetSelected.container = btn.closest('.sumo-asset-select');
			var url = btn.closest('.sumo-asset-select').data('crop-url');
			var data = {
				'id': input.data('id'),
				'column': input.data('thumbnail'),
				'asset_id': assetSelected.container.find('.sumo-asset').val()
			}
			$.ajax({
				type : 'GET',
				url: url,
				data : data,
				dataType : 'json',
				success : function(data) {
					showNotify('Redirecting.');
					setTimeout(function() {
						window.location = data.redirect;
					}, 1000);
				},
				error : function(data, text, error) {

				}
			});
		});
		assetSelect.find('.remove').on('click', function(e) {
			e.preventDefault();
			var btn = $(this);
			var asset = btn.closest('.sumo-asset-select');
			asset.find('.sumo-asset').val('');
			asset.find('img').attr('src', '');
		});
	}
	function checkSelectedAsset(asset) {
		var container = asset;
		var id = container.find('.sumo-asset').val();
		var url = assetDetail.data('url');
		$.ajax({
			type : 'GET',
			url: url,
			data : {id: id},
			dataType : 'json',
			success : function(asset) {
				assetSelected.container = container;
				assetSelected.id = asset.id;
				assetSelected.path = asset.absolute_path;
				displaySelectedAsset();
			},
			error : function(data, text, error) {
				
			},
			complete: function(event,xhr,options) {
				container.find('.loader').remove();
			}
		});
	}

	//===== INITIALIZE IMAGE FOR VIEWING
	assetDisplay.each(function() {
		var container = $(this);
		var id = container.data('id');
		var url = container.data('url');
		container.append('<div class="loader loader-asset"><div class="spinner"></div></div>');

		$.ajax({
			type : 'GET',
			url: url,
			data : {id: id},
			dataType : 'json',
			success : function(asset) {
				var img = new Image();
				img.src = asset.absolute_path;
				img.alt = asset.alt;
				container.append(img);
			},
			error : function(data, text, error) {
				
			},
			complete: function(event,xhr,options) {
				container.find('.loader').remove();
			}
		});
	});
	
})();