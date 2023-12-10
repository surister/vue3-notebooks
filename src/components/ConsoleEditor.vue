<script setup>
import {VAceEditor} from "vue3-ace-editor";

import 'ace-builds/src-noconflict/ext-language_tools'
import 'ace-builds/src-noconflict/mode-python'
import langTools from 'ace-builds/src-noconflict/ext-language_tools'
import {onMounted, ref, watch} from "vue";
import 'ace-builds/src-noconflict/ace'
import {
  CRATE_FUNCTIONS,
  CRATE_KEYWORDS,
  CRATE_VALUES,
  DATA_TYPES
} from "@/store/crate_api/crate_lang";


const props = defineProps({
  minLines: {
    default: null,
    type: [Number, String]
  },
  maxLines: {
    default: null,
    type: [Number, String]
  },
  content: {
    type: String
  },
  read_only: {
    type: Boolean,
    default: false
  },
  hide_cursor: {
    type: Boolean,
    default: false
  },
  unclickable: {
    type: Boolean,
    default: false
  },
  language: {
    type: String,
    default: 'sql'
  }
})

const editor = ref(null)


function group_keywords(arr, token, value_name = null) {
  let result_array = []
  for (const el of arr) {
    const keyword_name = value_name == null ? el : el[value_name]
    result_array.push(
      {
        token: token,
        value: keyword_name,
        regex: keyword_name,
      }
    )
  }
  return result_array
}

const kwmap = [
  {defaultToken: "text"},
  {
    token: "comment",
    regex: "--.*$"
  },
  {
    token: "string",
    regex: '".*?"'
  },
  {
    token: "string",
    regex: "'.*?'"
  },
  {
    token: "string",
    regex: "`.*?`"
  },
  {
    token: "integers",
    regex: '(?<!\\.)\\d+(?!\\.)'
  },
  ...group_keywords(CRATE_VALUES, 'value'),
  ...group_keywords(CRATE_KEYWORDS, 'keyword'),
  ...group_keywords(DATA_TYPES, 'datatype', 'name'),
  ...group_keywords(CRATE_FUNCTIONS, 'function')
]

function set_custom_sql() {
  let myCompleter = {
    getCompletions: function (editor, session, pos, prefix, callback) {
      callback(null, kwmap.map(function (key) {
        return {
          caption: key.value,
          value: key.value,
          meta: key.token,
          score: 1000
        };
      }));
    }
  };

  langTools.addCompleter(myCompleter);

  editor.value.session.setMode('ace/mode/text', function () {
    let rules = editor.value.session.$mode.$highlightRules.getRules();
    for (const rule of kwmap) {
      rules['start'].unshift({
        token: rule.token,
        regex: rule.regex
      });
    }

    // force recreation of tokenizer
    editor.value.session.$mode.$tokenizer = null;
    editor.value.session.bgTokenizer.setTokenizer(editor.value.session.$mode.getTokenizer());

    // force re-highlight whole document
    editor.value.session.bgTokenizer.start(0);
  })

  if (props.hide_cursor) {
    // Removes the cursor if in clickable mode.
    editor.value.renderer.$cursorLayer.element.style.display = "none"
  }
}

onMounted(() => {
  set_custom_sql()
})

let _content = ref(props.content)

watch(() => props.language, () => {
  if (props.language === 'python') {
    editor.value.session.setMode('ace/mode/python')
    return
  }

  if (props.language === 'md') {
    editor.value.session.setMode('ace/mode/text')
    return
  }

  if (props.language === 'sql') {
    set_custom_sql()
  }
})
watch(
  () => props.content, (prev) => {
    _content.value = prev

    if (_content.value.startsWith('%md') && editor.value.$enableLiveAutocompletion) {
      editor.value.setOptions({enableLiveAutocompletion: false})
    }

    if (!_content.value.startsWith('%md')) {
      editor.value.setOptions({enableLiveAutocompletion: true})
    }
  }
)

let options = {enableLiveAutocompletion: true}

if (props.unclickable) {
  options = {...options, ...{highlightGutterLine: false, highlightActiveLine: false}}
}
</script>

<template>
  <VAceEditor @init="(el) => {
      editor = el
      const handler = editor.textInput.getElement()
      handler.addEventListener('keydown', (e) => {
          // Emit only arrow up,left,right and down events which are blocked by default on ACE.
          if ([37,38,39,40].includes(e.keyCode)){$emit('keydown', e)
        }
      })
  }"
              v-model:value="_content"
              @change="$emit('update:content', _content)"
              :print-margin="false"
              :options="options"
              :readonly="read_only"
              :style="{'font-size': '20px', 'pointer-events': unclickable ? 'none': '' }"
              :min-lines="minLines || '3'"
              :max-lines="maxLines || 100"/>
</template>

<style>
.ace_autocomplete * {
  font-size: 20px !important;
}

.ace_keyword {
  color: purple !important;
}

.ace_comment {
  color: gray !important;
}

.ace_string {
  color: green !important;
}

.ace_function {
  color: brown;
}

.ace_datatype{
  color: red;
}

.ace_value{
  color: #EE8E4A;
}

.ace_integers {
  color: #0d47a1;
}
</style>
