import dayjs from "dayjs";

export class Document {
  constructor(
    id,
    title,
    stakeholders,
    scale,
    issuanceDate,
    type,
    nrConnections,
    language,
    nrPages,
    geolocation,
    description
  ) {
    this.id = id;
    this.title = title;
    this.stakeholders = stakeholders;
    this.scale = scale;
    this.issuanceDate = issuanceDate ? issuanceDate : "-";
    this.type = type;
    this.nrConnections = nrConnections;
    this.language = language;
    this.nrPages = nrPages;
    this.geolocation = geolocation;
    this.description = description;
  }

  static fromJson(json) {
    return new Document(
      json.id,
      json.title,
      json.stakeholders,
      json.scale,
      json.issuanceDate,
      json.type,
      json.nrConnections,
      json.language,
      json.nrPages,
      json.geolocation,
      json.description
    );
  }
}

export class DocumentSnippet {
  constructor(id, title, scale, issuanceDate, type, geolocation, stakeholders) {
    this.id = id;
    this.title = title;
    this.scale = scale;
    this.issuanceDate = issuanceDate ? issuanceDate : "-";
    this.type = type;
    this.geolocation = geolocation;
    this.stakeholders = stakeholders;
  }

  static fromJson(json) {
    return new DocumentSnippet(
      json.id,
      json.title,
      json.scale,
      json.issuanceDate,
      json.type,
      json.geolocation,
      json.stakeholders
    );
  }
}

export default { Document, DocumentSnippet };
