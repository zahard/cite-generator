window.onload = function()
{
	window.citeCreator = new CiteCreator(800,400);

}


function CiteCreator(width, height)
{
	
	this.width = width;
	this.height = height;

	this.wrapper = $('wrapper');
	this.editor = $('user-layout');
	this.file = $('photoInput');
	this.nameInput = $('nameInput');
	this.nameSecondInput = $('nameSecondInput');
	this.textInput = $('textInput');
	this.renderButton = $('render');
	
	this.wrapper.style.width = width + 'px';
	this.wrapper.style.height = height + 'px';
	
	this.offsetTop = this.editor.offsetTop;
	this.offsetLeft = this.editor.offsetLeft;

	this.layerToClear = [];
	this.curvePoints = [];
	this.linePoints = [];

	this.layers = {
		background:    new Layer( $('background'), width, height, 1),
	};

	
	this.photoImage = null;

	this.backPic = $('backPic');

	this.addListeners();

	this.drawTemplate();

}


CiteCreator.prototype.getData = function() {
	return {
		name: this.nameInput.value, 
		nameSecond: this.nameSecondInput.value, 
		text: textInput.value,
		photo: this.photoImage
	}
}

CiteCreator.prototype.drawTemplate = function() {

	var data = this.getData();

	var cxt = this.layers.background;

	cxt.empty();

	this.drawPhoto();

	//DraW back
	cxt.drawImage(this.backPic, 0,0 ,  1600,800 , 0,0, 800, 400);

	var textLeftOffset = 300;
	var textTopOffset = data.nameSecond ? 95: 110;
	var fontSize = 30;
	var rowSpace = 0;


	cxt.setProperties({
		fillStyle: '#2c3e50',
		font: "bold " + fontSize + "px 'Roboto Slab' "
	})

	cxt.fillText(data.name, textLeftOffset, textTopOffset)
	if (data.nameSecond) {
		cxt.fillText(data.nameSecond, textLeftOffset, textTopOffset + rowSpace + fontSize)
	}

	////////////////////////////////////////////

	var textFontSize = 32;
	var topOffset = 240;
	var leftOffset  = 80;
	var rowOffset = 5;

	cxt.setProperties({
		fillStyle: '#2c3e50',
		font: textFontSize + "px 'Roboto Slab' "
	})

	var rows = data.text.split('\n');
	for (var i=0; i < rows.length; i++)
	{
		var text = rows[i].trim();
		cxt.fillText(text, leftOffset, topOffset + (textFontSize + rowOffset)*i);
	}

}

CiteCreator.prototype.drawPhoto = function() {
	var photoCxt = this.layers.background;
	photoCxt.empty();

	if (!this.photoImage) return;

	var w = this.photoImage.width;
	var h = this.photoImage.height;
	var targetSize = 125;
	var targetX = 152;
	var targetY = 42;
	
	var sourceH = h;
	var sourceW = w;

	sourceX = 0;
	sourceY = 0;

	//Crop image if it not square
	if(w != h)
	{
		if (w > h)
		{
			sourceW = h;
			sourceX = (w-h)/2;
		}else{
			sourceH = w;
			sourceY = (h-w)/2;
		}
	}


	photoCxt.drawImage(this.photoImage, sourceX, sourceY, sourceW, sourceH, targetX, targetY, targetSize,targetSize);
}

CiteCreator.prototype.addListeners = function() {
	this.file.addEventListener('change', function(e){
		console.log(e)

		var img = new Image;
		img.onload = function() {
		    this.photoImage = img;
		}.bind(this)
		img.src = URL.createObjectURL(e.target.files[0]);

	}.bind(this))

	this.renderButton.addEventListener('click', function(){
		this.drawTemplate();
	}.bind(this))

};