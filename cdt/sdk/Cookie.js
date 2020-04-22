// Copyright 2019 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 *  @unrestricted
 */
export class Cookie {
  /**
     * @param {string} name
     * @param {string} value
     * @param {?Type=} type
     * @param {!Protocol.Network.CookiePriority=} priority
     */
  constructor(name, value, type, priority) {
    this._name = name;
    this._value = value;
    this._type = type;
    this._attributes = {};
    this._size = 0;
    this._priority = /** @type {!Protocol.Network.CookiePriority} */ (priority || 'Medium');
    /** @type {string|null} */
    this._cookieLine = null;
  }

  /**
     * @param {!Protocol.Network.Cookie} protocolCookie
     * @return {!Cookie}
     */
  static fromProtocolCookie(protocolCookie) {
    const cookie = new Cookie(protocolCookie.name, protocolCookie.value, null, protocolCookie.priority);
    cookie.addAttribute('domain', protocolCookie['domain']);
    cookie.addAttribute('path', protocolCookie['path']);
    cookie.addAttribute('port', protocolCookie['port']);
    if (protocolCookie['expires']) {
      cookie.addAttribute('expires', protocolCookie['expires'] * 1000);
    }
    if (protocolCookie['httpOnly']) {
      cookie.addAttribute('httpOnly');
    }
    if (protocolCookie['secure']) {
      cookie.addAttribute('secure');
    }
    if (protocolCookie['sameSite']) {
      cookie.addAttribute('sameSite', protocolCookie['sameSite']);
    }
    cookie.setSize(protocolCookie['size']);
    return cookie;
  }

  /**
   * @returns {string}
   */
  key() {
    return (this.domain() || '-') + ' ' + this.name() + ' ' + (this.path() || '-');
  }

  /**
     * @return {string}
     */
  name() {
    return this._name;
  }

  /**
     * @return {string}
     */
  value() {
    return this._value;
  }

  /**
     * @return {?Type|undefined}
     */
  type() {
    return this._type;
  }

  /**
     * @return {boolean}
     */
  httpOnly() {
    return 'httponly' in this._attributes;
  }

  /**
     * @return {boolean}
     */
  secure() {
    return 'secure' in this._attributes;
  }

  /**
     * @return {!Protocol.Network.CookieSameSite}
     */
  sameSite() {
    // TODO(allada) This should not rely on _attributes and instead store them individually.
    return /** @type {!Protocol.Network.CookieSameSite} */ (this._attributes['samesite']);
  }

  /**
   * @return {!Protocol.Network.CookiePriority}
   */
  priority() {
    return this._priority;
  }

  /**
     * @return {boolean}
     */
  session() {
    // RFC 2965 suggests using Discard attribute to mark session cookies, but this does not seem to be widely used.
    // Check for absence of explicitly max-age or expiry date instead.
    return !('expires' in this._attributes || 'max-age' in this._attributes);
  }

  /**
     * @return {string}
     */
  path() {
    return this._attributes['path'];
  }

  /**
     * @return {string}
     */
  port() {
    return this._attributes['port'];
  }

  /**
     * @return {string}
     */
  domain() {
    return this._attributes['domain'];
  }

  /**
     * @return {number}
     */
  expires() {
    return this._attributes['expires'];
  }

  /**
     * @return {string}
     */
  maxAge() {
    return this._attributes['max-age'];
  }

  /**
     * @return {number}
     */
  size() {
    return this._size;
  }

  /**
     * @return {string|null}
     */
  url() {
    if (!this.domain() || !this.path()) {
      return null;
    }
    return (this.secure() ? 'https://' : 'http://') + this.domain() + this.path();
  }

  /**
     * @param {number} size
     */
  setSize(size) {
    this._size = size;
  }

  /**
     * @return {!Date|null}
     */
  expiresDate(requestDate) {
    // RFC 6265 indicates that the max-age attribute takes precedence over the expires attribute
    if (this.maxAge()) {
      return new Date(requestDate.getTime() + 1000 * this.maxAge());
    }

    if (this.expires()) {
      return new Date(this.expires());
    }

    return null;
  }

  /**
   * @param {string} key
   * @param {string|number=} value
   */
  addAttribute(key, value) {
    const normalizedKey = key.toLowerCase();
    switch (normalizedKey) {
      case 'priority':
        this._priority = /** @type {!Protocol.Network.CookiePriority} */ (value);
        break;
      default:
        this._attributes[normalizedKey] = value;
    }
  }

  /**
     * @param {string} cookieLine
     */
  setCookieLine(cookieLine) {
    this._cookieLine = cookieLine;
  }

  /**
     * @return {string|null}
     */
  getCookieLine() {
    return this._cookieLine;
  }
}

/**
 * @enum {number}
 */
export const Type = {
  Request: 0,
  Response: 1
};

/**
 * @enum {string}
 */
export const Attributes = {
  Name: 'name',
  Value: 'value',
  Size: 'size',
  Domain: 'domain',
  Path: 'path',
  Expires: 'expires',
  HttpOnly: 'httpOnly',
  Secure: 'secure',
  SameSite: 'sameSite',
  Priority: 'priority',
};
