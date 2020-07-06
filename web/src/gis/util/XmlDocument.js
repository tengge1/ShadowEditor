/*
 * Copyright 2003-2006, 2009, 2017, United States Government, as represented by the Administrator of the
 * National Aeronautics and Space Administration. All rights reserved.
 *
 * The NASAWorldWind/WebWorldWind platform is licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// It simply adds XmlParser, which encapsulates the fact that, there are different implementations
import ArgumentError from '../error/ArgumentError';
import Logger from '../util/Logger';
/**
 * Constructor function responsible for abstracting away the complexities in parsing XmlDocuments.
 * @param document String representation of the xml document.
 * @constructor
 */
function XmlDocument(document) {
    /**
     * Retrieved textual representation of the document.
     */
    this._document = document;
}

/**
 * This method abstracts parsing of XmlDocument away form users of this class. It should work in all browsers
 * since IE5
 * @returns {Document} Parsed dom.
 */
XmlDocument.prototype.dom = function () {
    if (DOMParser) {
        var parser = new DOMParser();
        var parsedDocument = parser.parseFromString(this._document, "text/xml");
        if (parsedDocument.getElementsByTagName("parsererror").length || !parsedDocument) {
            throw new ArgumentError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "XmlDocument", "dom", "Invalid XML document. " +
                    parsedDocument.getElementsByTagName("parsererror")[0].innerHTML)
            );
        }
        return parsedDocument;
    } else {
        // Support for IE6
        var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = false;
        xmlDoc.loadXML(text);
        return xmlDoc;
    }
};

XmlDocument.isValid = function (document) {
    // TODO refactor.
    try {
        new XmlDocument(document).dom();
        return true;
    } catch (e) {
        return false;
    }
};

export default XmlDocument;
