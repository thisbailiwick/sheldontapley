var moreInfo = {
	infoButtons: null,
	init: function () {
		this.infoButtons = document.querySelectorAll(".actions .info");
		this.infoButtons.forEach(function (button) {
			var imageWrap = button.closest(".image-wrap");
			var pieceComparisonWrap = imageWrap.querySelector(".piece-comparison-wrap");

			var pieceComparisonWrapWidthPixels = pieceComparisonWrap.clientWidth;
			var pieceComparisonWrapHeightPixels = pieceComparisonWrap.clientHeight;

			// piece image
			// var {piece, pieceImageNaturalWidth, pieceImageNaturalHeight, pieceWidthInches, pieceHeightInches, pieceHeightImageRatio, pieceWidthImageRatio} = this.getImageDimensions(pieceComparisonWrap, button);
			var piece = pieceComparisonWrap.querySelector(".comparison-image");
			var pieceScaleWidthInches = button.getAttribute("data-width");
			var pieceImageDimensions = this.getImageDimensions(piece, pieceScaleWidthInches);
			// console.log('pieceComparisonWrapHeightPixels > window.innerHeight: ' + pieceComparisonWrapHeightPixels, window.innerHeight);
			// if(pieceComparisonWrapHeightPixels > window.innerHeight){
			// 	pieceComparisonWrapHeightPixels = window.innerHeight;
			// }
			//
			// console.log(pieceComparisonWrapHeightPixels);

			// forscale image
			var forScale = pieceComparisonWrap.querySelector(".compared-to");
			var forScaleScaleWidthInches = button.getAttribute("data-compare-width-inches");
			var forScaleDimensions = this.getImageDimensions(forScale, forScaleScaleWidthInches);


			// info text - caption below piece
			var infoText = imageWrap.querySelector(".info-text");
			var infoTextHeightPixels = infoText.clientHeight;

			// get the new dimensions
			// var dimensionValues = this.calculateNewDimensions(pieceWidthInches, pieceImageNaturalWidth, pieceImageNaturalHeight, forScaleWidthInches, pieceHeightInches, forScaleHeightInches, pieceComparisonWrapWidthPixels, pieceComparisonWrapHeightPixels, pieceHeightImageRatio, pieceWidthImageRatio, forScaleHeightImageRatio, piece, forScale, pieceComparisonWrap);
			var dimensionValues = this.calculateNewDimensions(pieceImageDimensions, forScaleDimensions, pieceComparisonWrapWidthPixels, pieceComparisonWrapHeightPixels, pieceComparisonWrap);
			//console.log('dimensionValues: ', JSON.stringify(dimensionValues));

			piece.style.width = dimensionValues.pieceWidthPixels + "px";
			piece.style.height = dimensionValues.pieceHeightPixels + "px";
			forScale.style.width = dimensionValues.forScaleWidthPixels + "px";
			forScale.style.height = dimensionValues.forScaleHeightPixels + "px";
		}, this);
	},
	getImageDimensions: function (image, scaleWidthInches) {
		var fileNaturalWidth = image.naturalWidth;
		var fileNaturalHeight = image.naturalHeight;
		var naturalFileRatio = fileNaturalWidth / fileNaturalHeight;
		// var heightInches = button.getAttribute("data-height");
		var heightInches = scaleWidthInches / naturalFileRatio;
		var heightRatioInches = heightInches / scaleWidthInches;
		var widthRatioInches = scaleWidthInches / heightInches;
		return {
			image: image,
			fileNaturalWidth: fileNaturalWidth,
			fileNaturalHeight: fileNaturalHeight,
			scaleWidthInches: scaleWidthInches,
			heightInches: heightInches,
			heightRatioInches: heightRatioInches,
			widthRatioInches: widthRatioInches
		};
	},
	getNewValue: function(value){
		return value * .997531;
	},
	recalculateNewDimensions: function (dimensionValues) {
		var originalHeightRatio = dimensionValues.pieceHeightPixels / dimensionValues.forScaleHeightPixels;
		var originalWidthRatio = dimensionValues.pieceWidthPixels / dimensionValues.forScaleWidthPixels;
		do {
			dimensionValues.pieceWidthPixels = this.getNewValue(dimensionValues.pieceWidthPixels);
			// dimensionValues.pieceHeightPixels = this.getNewValue(dimensionValues.pieceHeightPixels);
			dimensionValues.pieceHeightPixels = this.getImageHeightPixels(dimensionValues.pieceWidthPixels, dimensionValues.pieceHeightImageRatio);

			dimensionValues.forScaleWidthPixels = this.getNewValue(dimensionValues.forScaleWidthPixels);
			// dimensionValues.forScaleHeightPixels = this.getNewValue(dimensionValues.forScaleHeightPixels);
			dimensionValues.forScaleHeightPixels = this.getImageHeightPixels(dimensionValues.forScaleWidthPixels, dimensionValues.forScaleHeightImageRatio);



			// console.log('piece forscale height ratio: ' + dimensionValues.pieceHeightPixels / dimensionValues.forScaleHeightPixels);
			// console.log('piece forscale width ratio: ' + dimensionValues.pieceWidthPixels / dimensionValues.forScaleWidthPixels);
			// console.log('original height ratio: ' + originalHeightRatio);
			// console.log('original width ratio: ' + originalWidthRatio);
			// console.log('piece forscale height ratio % change: ' + (100 - (originalHeightRatio / (dimensionValues.pieceHeightPixels / dimensionValues.forScaleHeightPixels) * 100)) + '%');
			// console.log('piece forscale width ratio % change: ' + (100 - (originalWidthRatio / (dimensionValues.pieceWidthPixels / dimensionValues.forScaleWidthPixels) * 100)) + '%');
			// console.log("pieceComparisonWrapHeightPixels: " + dimensionValues.pieceComparisonWrapHeightPixels);
			// console.log('pieceWidthPixels--: ' + dimensionValues.pieceWidthPixels);
			// console.log("pieceHeightPixels--: " + dimensionValues.pieceHeightPixels);
			// console.log('pieceRatio: ' + dimensionValues.pieceWidthPixels / dimensionValues.pieceHeightPixels);
			// console.log('forScaleWidthPixels--: ' + dimensionValues.forScaleWidthPixels);
			// console.log("forScaleHeightPixels-- " + dimensionValues.forScaleHeightPixels);
			// console.log('forscale ratio: ' + dimensionValues.forScaleWidthPixels / dimensionValues.forScaleHeightPixels);
			// console.log('');
			// console.log('');
		} while (
			//make sure piece height is shorter than piece comparison wrap height
		dimensionValues.pieceHeightPixels > dimensionValues.pieceComparisonWrapHeightPixels ||
		//make sure forscale height is shorter than piece comparison wrap height
		dimensionValues.forScaleHeightPixels > dimensionValues.pieceComparisonWrapHeightPixels ||
		(dimensionValues.pieceWidthPixels + dimensionValues.forScaleWidthPixels) > dimensionValues.pieceComparisonWrapWidthPixels);
		return {
			pieceWidthPixels: dimensionValues.pieceWidthPixels,
			pieceHeightPixels: dimensionValues.pieceHeightPixels,
			forScaleWidthPixels: dimensionValues.forScaleWidthPixels,
			forScaleHeightPixels: dimensionValues.forScaleHeightPixels
		};
	},
	getImageHeightPixels: function(imageWidthPixels, imageHeightRatio){
		return imageWidthPixels * imageHeightRatio;
	},
	getImageWidthPixels: function (imageHeightPixels, imageWidtheRatio) {
		return Math.floor(imageHeightPixels * imageWidtheRatio);
	},
	// getPieceHeightPixels: function (pieceWidthPixels, pieceHeightImageRatio) {
	// 	return pieceWidthPixels * pieceHeightImageRatio;
	// 	// return Math.floor(pieceWidthPixels * pieceHeightImageRatio);
	// },
	// getForScaleHeightPixels: function (forScaleWidthPixels, forScaleHeightImageRatio) {
	// 	return forScaleWidthPixels * forScaleHeightImageRatio;
	// 	// return Math.floor(forScaleWidthPixels * forScaleHeightImageRatio);
	// },
	// getPieceWidthPixels: function (pieceHeightPixels, pieceWidthImageRatio) {
	// 	return Math.floor(pieceHeightPixels * pieceWidthImageRatio);
	// },
	// getForScaleWidthPixels: function (forScaleHeightPixels, forScaleWidthImageRatio) {
	// 	return Math.floor(forScaleHeightPixels * forScaleWidthImageRatio);
	// },
	// calculateNewDimensions: function (pieceWidthInches, pieceImageNaturalWidth, pieceImageNaturalHeight, forScaleWidthInches, pieceHeightInches, forScaleHeightInches, pieceComparisonWrapWidthPixels, pieceComparisonWrapHeightPixels, pieceHeightImageRatio, pieceWidthImageRatio, forScaleHeightImageRatio, pieceImage, forScale, pieceComparisonWrap) {
	calculateNewDimensions: function (pieceDimensions, forScaleDimensions, pieceComparisonWrapWidthPixels, pieceComparisonWrapHeightPixels, pieceComparisonWrap) {
		console.log(pieceComparisonWrapWidthPixels);
		// this is the ratio of piece width to forscale width
		// var pieceScaleWidthRatio = pieceWidthInches / forScaleWidthInches;
		// var pieceScaleHeightRatio = pieceHeightInches / forScaleHeightInches;

		// if the image rotation is portrait we find who is the widest, if landscape then we find who is tallest
		// we then set the baseline height or width to the spacing we have from pieceComparisonWrapHeightPixels or pieceComparisonWrapWidthPixels
		var widthBaseline = null;
		var heightBaseline = null;

		var pieceImageRotation = utilities.getImageSizeChangeTechnique(pieceDimensions.image, pieceComparisonWrap);
		var forScaleImageRotation = utilities.getImageSizeChangeTechnique(forScaleDimensions.image, pieceComparisonWrap);
		console.log(pieceImageRotation);
		console.log(forScaleImageRotation);

		var pieceWidthPixels = null;
		var pieceHeightPixels = null;
		if (pieceImageRotation === 'width') {
			widthBaseline = pieceComparisonWrapWidthPixels;

			// calculate the pixel amounts based off of the baseline

			// piece values
			pieceWidthPixels = widthBaseline;
			pieceHeightPixels = this.getImageHeightPixels(pieceWidthPixels, pieceDimensions.heightRatioInches);

			console.log('pieceScaleWidthRatio / pieceWidthPixels: ' + forScaleDimensions.widthRatioInches, pieceWidthPixels);
			// forscale values based off of the piece amounts relative to the piece/forscale ratio
		} else {
			heightBaseline = pieceComparisonWrapHeightPixels;
			// calculate the pixel amounts based off of the baseline

			// piece values
			pieceHeightPixels = heightBaseline;
			pieceWidthPixels = this.getImageWidthPixels(pieceHeightPixels, pieceDimensions.widthRatioInches);

		}
		// forscale values based off of the piece amounts relative to the piece/forscale ratio
		var forScaleWidthPixels = Math.floor(pieceWidthPixels * forScaleDimensions.widthRatioInches);
		var forScaleHeightPixels = Math.floor(pieceHeightPixels * forScaleDimensions.heightRatioInches);


		// console.log("forScaleScreenWidthPercentage * widthRatio:  " + forScaleScreenWidthPercentage, pieceScaleWidthRatio);
		// var newWidthPercentage = forScaleScreenWidthPercentage * pieceScaleWidthRatio;
		// var pieceWidthPixels = pieceComparisonWrapWidthPixels * (newWidthPercentage / 100);
		// var forScaleWidthPixels = pieceComparisonWrapWidthPixels * (forScaleScreenWidthPercentage / 100);
		// var dimensionValues = {
		// 	pieceWidthPixels: Math.floor(pieceWidthPixels),
		// 	pieceHeightPixels: this.getPieceHeightPixels(pieceWidthPixels, pieceHeightImageRatio),
		// 	forScaleWidthPixels: Math.floor(forScaleWidthPixels),
		// 	forScaleHeightPixels: this.getForScaleHeightPixels(forScaleWidthPixels, forScaleHeightImageRatio),
		// 	forScaleHeightImageRatio: forScaleHeightImageRatio,
		// 	pieceHeightImageRatio: pieceHeightImageRatio,
		// 	pieceComparisonWrapWidthPixels: pieceComparisonWrapWidthPixels,
		// 	pieceComparisonWrapHeightPixels: pieceComparisonWrapHeightPixels
		// };

		var dimensionValues = {
			pieceWidthPixels: Math.floor(pieceWidthPixels),
			pieceHeightPixels: pieceHeightPixels,
			forScaleWidthPixels: forScaleWidthPixels,
			forScaleHeightPixels: forScaleHeightPixels,
			forScaleHeightImageRatio: forScaleDimensions.heightRatioInches,
			pieceHeightImageRatio: pieceDimensions.heightRatioInches,
			pieceComparisonWrapWidthPixels: pieceComparisonWrapWidthPixels,
			pieceComparisonWrapHeightPixels: pieceComparisonWrapHeightPixels
		};
		// console.log("newWidthPercentage: " + newWidthPercentage);
		console.log('dimensionValues before object.assign: ', JSON.stringify(dimensionValues));


		dimensionValues = Object.assign(this.recalculateNewDimensions(dimensionValues), dimensionValues);

		// let's put some space between the images
		var betweenImageMarginPixels = pieceComparisonWrapWidthPixels * .03;
		console.log(betweenImageMarginPixels);
		dimensionValues.pieceWidthPixels = dimensionValues.pieceWidthPixels - betweenImageMarginPixels;
		dimensionValues.forScaleWidthPixels = dimensionValues.forScaleWidthPixels - betweenImageMarginPixels;

		// do the heights
		dimensionValues.forScaleHeightPixels = this.getImageHeightPixels(dimensionValues.forScaleWidthPixels, dimensionValues.forScaleHeightImageRatio);
		dimensionValues.pieceHeightPixels = this.getImageHeightPixels(dimensionValues.pieceWidthPixels, dimensionValues.pieceHeightImageRatio);
		console.log('dimensionValues after object.assign: ', JSON.stringify(dimensionValues));

		return dimensionValues;
	}
};
