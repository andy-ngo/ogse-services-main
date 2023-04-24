import Core from '../tools/core.js';

if (!window.streamSaver || !window.ZIP || !window.zip) {
	console.warn("Unable to zip or unzip, some required scripts were not added.");
}

else {
	var path = location.href.split("/").slice(0,-2).join("/");
	
	zip.workerScriptsPath = path + "/app-references/zip/";
}	
/** 
 * A utility class that contains a series functions used to read / write Zip files.
 * Requires the zip.js library.
 **/
export default class Zip {
	
	/**
	* Zips a series of files and downloads it. 
	* @param {string} name - the name of the file to create
	* @param {File[]} files - an array of files to zip and download
	* @return {promise} a Promise that resolves when the piping process has completed.
	*/
	static save_zip_stream(name, files) {
		// TODO : All this should be done on the server, otherwise 4GB limit
		const readableZipStream = new ZIP({
			start (ctrl) {
				files.forEach(f => ctrl.enqueue(f));
			},
			async pull (ctrl) {
				ctrl.close();
			}
		});
		
		const fileStream = streamSaver.createWriteStream(name + '.zip'/*, {
			size: 22, // (optional) Will show progress
			writableStrategy: undefined, // (optional)
			readableStrategy: undefined  // (optional)
		  }*/);

		return readableZipStream.pipeTo(fileStream);
	}
	
	/**
	* Reads a zip archive from as Blob and returns the files contained in it.
	* @param {Blob} blob - The blob containing the zip file
	* @return {promise} a promise that will be resolved with the files read from the zip archive
	*/
	static load_zip(blob) {
		var d = Core.defer();
		
		var r = new zip.BlobReader(blob);
		
		var created = (reader) => {	Zip.read_zip(reader).then(finished, failure); }
		
		var finished = (result) => { d.Resolve({ files:result }); }

		var failure = (error) => { d.Reject(error); }
		
		zip.createReader(r, created, (ev) => { failure(new Error("Unable to create zipReader.")) });
		
		return d.promise;
	}

	/**
	* Reads an entry in the zip archive
	* @param {Entry} entry - a zip.Entry to read
	* @return {promise} a promise that will be resolved with the content of the entry as a file object
	*/
	static read_entry(entry) {
		var d = Core.defer();
		
		entry.getData(new zip.TextWriter(), function(text) {
			var blob = new Blob([text], { type: "text/plain" });
			var file = new File([blob], entry.filename);

			d.Resolve(file);
		});
		
		return d.promise;
	}

	/**
	* Reads a zip archive using a provided BlobReader and returns the files contained in it.
	* @param {BlobReader} reader - a zip.BlobReader object used to read the zip entries
	* @return {promise} a promise that will be resolved with the files read from the zip archive
	*/
	static read_zip(reader) {
		var d = Core.defer();
		
		reader.getEntries(function(entries) {
			var defs = entries.map(e => { return Zip.read_entry(e); });
			
			Promise.all(defs).then(function(files) {
				reader.close();
				
				// var files = data.map(d => { return d; });
						
				d.Resolve(files);	
			});
		});
				
		return d.promise;
	}
}
