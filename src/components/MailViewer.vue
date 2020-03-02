<template>
  <div class="flex flex-col h-full">
    <p class="text-xl font-semibold">{{ mail.subject }}</p>
    <div class="flex justify-between items-baseline">
      <p class="text-sm">Sent at: {{ mail.date }}</p>
      <a href="#" v-on:click="deleteMail()"
         class="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded font-semibold text-sm uppercase tracking-wide">
        Delete
      </a>
    </div>
    <div class="rounded border mt-2 mb-4 overflow-hidden bg-white">
      <div class="flex justify-between items-center px-2 py-1 border-b">
        <p>From:</p>
        <p>{{ mail.from.text }}</p>
      </div>
      <div class="flex justify-between items-center px-2 py-1 border-b">
        <p>To:</p>
        <p>{{ mail.to.text }}</p>
      </div>
      <div class="flex justify-between items-center px-2 py-1" :class="mail.attachments.length > 0 ? 'border-b' : ''">
        <p>Message ID:</p>
        <p>{{ mail.messageId }}</p>
      </div>
      <div v-if="mail.attachments.length > 0" class="flex justify-between items-center px-2 py-1">
        <p>Attachments:</p>
        <div>
          <a v-for="(item, index) in mail.attachments" :key="index" class="text-blue-500 underline">
            {{ item.filename }}
          </a>
        </div>
      </div>
    </div>
    <iframe :srcdoc="mail.html" class="flex-grow w-full border rounded bg-white"></iframe>
  </div>
</template>

<script>
  import relativeDate from "../utils";

  export default {
    name: "MailViewer",
    props: {
      index: {},
      mail: {}
    },
    methods: {
      relativeDate: (date) => {
        return relativeDate(date)
      },
      deleteMail: function() {
        this.$store.dispatch('deleteMail', {
          index: this.index
        });
      },
      blob: function (item) {
        const byteArray = new Uint8Array(item.content.data)
        var a = window.document.createElement('a')

        a.href = window.URL.createObjectURL(new Blob([byteArray], { type: item.contentType }))
        a.download = item.filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      }
    }
  }
</script>

<style scoped></style>
