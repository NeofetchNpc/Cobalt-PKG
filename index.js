const axios = require("axios");
const ytdl = require("ytdl-core");

class CobaltAPI {
  constructor(url) {
    this.url = url;
    this.vCodec = "h264";
    this.vQuality = "720";
    this.aFormat = "mp3";
    this.filenamePattern = "classic";
    this.isAudioOnly = false;
    this.isTTFullAudio = false;
    this.isAudioMuted = false;
    this.dubLang = false;
    this.disableMetadata = false;
    this.twitterGif = false;
    this.tiktokH265 = false;
    this.acceptLanguage = null;
  }

  setQuality(quality) {
    const allowedQualities = [
      "max", "2160", "1440", "1080", "720", "480", "360", "240", "144"
    ];
    if (!allowedQualities.includes(quality)) {
      throw new Error("Invalid video quality");
    }
    this.vQuality = quality;
  }

  setFilenamePattern(pattern) {
    const allowedPatterns = ["classic", "pretty", "basic", "nerdy"];
    if (!allowedPatterns.includes(pattern)) {
      throw new Error("Invalid filename pattern");
    }
    this.filenamePattern = pattern;
  }

  setVCodec(codec) {
    const allowedCodecs = ["h264", "av1", "vp9"];
    if (!allowedCodecs.includes(codec)) {
      throw new Error("Invalid video codec");
    }
    this.vCodec = codec;
  }

  setAFormat(format) {
    const allowedFormats = ["best", "mp3", "ogg", "wav", "opus"];
    if (!allowedFormats.includes(format)) {
      throw new Error("Invalid audio format");
    }
    this.aFormat = format;
  }

  setAcceptLanguage(language) {
    this.acceptLanguage = language;
  }

  enableAudioOnly() {
    this.isAudioOnly = true;
  }

  enableTTFullAudio() {
    this.isTTFullAudio = true;
  }

  enableAudioMuted() {
    this.isAudioMuted = true;
  }

  enableDubLang() {
    this.dubLang = true;
  }

  enableDisableMetadata() {
    this.disableMetadata = true;
  }

  enableTwitterGif() {
    this.twitterGif = true;
  }

  enableTiktokH265() {
    this.tiktokH265 = true;
  }

  async sendRequest() {
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    if (this.acceptLanguage !== null) {
      headers["Accept-Language"] = this.acceptLanguage;
    }

    const data = {
      url: this.url,
      vQuality: this.vQuality,
      filenamePattern: this.filenamePattern,
      isAudioOnly: this.isAudioOnly,
      isTTFullAudio: this.isTTFullAudio,
      isAudioMuted: this.isAudioMuted,
      dubLang: this.dubLang,
      disableMetadata: this.disableMetadata,
      twitterGif: this.twitterGif,
      tiktokH265: this.tiktokH265,
      vCodec: this.vCodec,
      aFormat: this.aFormat,
    };

    try {
      const response = await axios.post(
        "https://api.cobalt.tools/api/json",
        data,
        { headers }
      );
      const statusCode = response.status;
      const responseData = response.data;

      if (statusCode === 200 && responseData.status !== "error") {
        return { status: true, data: responseData };
      } else {
        return {
          status: false,
          text: responseData.text || "An error occurred",
        };
      }
    } catch (error) {
      return {
        status: false,
        text: error.response ? error.response.data : error.message,
      };
    }
  }

  async getAvailableQualities() {
    if (!ytdl.validateURL(this.url)) {
      throw new Error("Invalid YouTube URL");
    }

    try {
      const info = await ytdl.getInfo(this.url);
      const formats = ytdl.filterFormats(info.formats, "video");
      const qualities = formats
        .map((format) =>
          format.qualityLabel.replace("p60", "").replace("p", "")
        )
        .filter((v, i, a) => a.indexOf(v) === i);
      return qualities;
    } catch (error) {
      throw new Error("Failed to fetch video qualities");
    }
  }
}

module.exports = CobaltAPI;
