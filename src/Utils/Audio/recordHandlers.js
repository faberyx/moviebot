/* eslint-disable no-console */
/*
 Copyright 2017-2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.

 Licensed under the Amazon Software License (the "License"). You may not use this file
 except in compliance with the License. A copy of the License is located at

 http://aws.amazon.com/asl/

 or in the "license" file accompanying this file. This file is distributed on an "AS IS"
 BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, express or implied. See the
 License for the specific language governing permissions and limitations under the License.
 */

/**
 * Vuex store recorder handlers
 */

/* eslint no-console: ["error", { allow: ["info", "warn", "error", "time", "timeEnd"] }] */
/* eslint no-param-reassign: ["error", { "props": false }] */

/**
 *
 * @param {*} recorder
 * @param {*} setMicState
 * @param {*} setMessage
 * @param {HTMLAudioElement} audio
 */
const initRecorderHandlers = (recorder, setMicState, setMessage, audio) => {
  /* global Blob */

  recorder.onstart = () => {
    console.info('recorder start event triggered');
    console.time('recording time');
    setMicState((prev) => ({ ...prev, recordState: 'recording' }));
  };
  recorder.onstop = () => {
    // context.dispatch('stopRecording');
    console.timeEnd('recording time');
    console.time('recording processing time');
    console.info('recorder stop event triggered');
  };
  recorder.onsilentrecording = () => {
    //console.info('recorder silent recording triggered');
    //  context.commit('increaseSilentRecordingCount');
  };
  recorder.onunsilentrecording = () => {
    // console.info('resetSilentRecordingCount');
    //if (context.state.recState.silentRecordingCount > 0) {
    //    context.commit('resetSilentRecordingCount');
    // }
  };
  recorder.onerror = (e) => {
    console.error('recorder onerror event triggered', e);
  };
  recorder.onstreamready = () => {
    console.info('recorder stream ready event triggered');
  };
  recorder.onmute = () => {
    // console.info('recorder mute event triggered');
    // context.commit('setIsMicMuted', true);
    setMicState((prev) => ({ ...prev, micState: 'muted' }));
  };
  recorder.onunmute = () => {
    // console.info('recorder unmute event triggered');
    // context.commit('setIsMicMuted', false);
    setMicState((prev) => ({ ...prev, micState: 'unmuted' }));
  };
  recorder.onquiet = () => {
    // console.info('recorder quiet event triggered');
    //  context.commit('setIsMicQuiet', true);
    setMicState((prev) => ({ ...prev, micState: 'quiet' }));
  };
  recorder.onunquiet = () => {
    // console.info('recorder unquiet event triggered');
    setMicState((prev) => ({ ...prev, micState: 'unquiet' }));
  };

  // TODO need to change recorder event setter to support
  // replacing handlers instead of adding
  recorder.ondataavailable = (e) => {
    const { mimeType } = recorder;

    const audioBlob = new Blob([e.detail], { type: mimeType });
    // XXX not used for now since only encoding WAV format
    // const audioUrl = URL.createObjectURL(audioBlob);
    // const audio = new Audio(audioUrl);
    // audio.play();

    let offset = 0;
    // offset is only needed for opus encoded ogg files
    // extract the offset where the opus frames are found
    // leaving for future reference
    // https://tools.ietf.org/html/rfc7845
    // https://tools.ietf.org/html/rfc6716
    // https://www.xiph.org/ogg/doc/framing.html
    if (mimeType.startsWith('audio/ogg')) {
      offset = 125 + e.detail[125] + 1;
    }
    console.timeEnd('recording processing time');
    setMicState((prev) => ({ recordState: 'stop', micState: 'off' }));
    const audioUrl = URL.createObjectURL(audioBlob);
    audio.src = audioUrl;
    audio.play();

    setMessage({
      audio: {
        blob: audioBlob,
        offset
      }
    });
  };
};
export default initRecorderHandlers;
