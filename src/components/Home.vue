<template>
  <div class="h-screen font-sans flex flex-col">
    <header class="shadow border-b">
      <p class="px-16 py-2 text-2xl font-semibold tracking-wide">MailCatcher</p>
    </header>
    <main v-if="mails.length > 0" class="px-16 py-2 flex-grow flex bg-gray-100">
      <section class="w-1/3 mr-2">
        <ul class="rounded border overflow-hidden">
          <li v-for="(item, index) in mails" :key="index" class="px-2 py-1 bg-white hover:bg-gray-200" v-bind:class="classObject(index)">
            <a href="#" v-on:click="selectMail(index)" class="flex justify-between items-center">
              <div>
                <p class="text-base font-semibold tracking-wide">{{ item.subject }}</p>
                <p class="text-sm">To: {{ item.to.text }} &middot; {{ relativeDate(item.date) }}</p>
              </div>
              <font-awesome-icon icon="chevron-right" />
            </a>
          </li>
        </ul>
      </section>
      <div class="w-2/3 ml-2">
        <MailViewer :mail="selectedMail" :index="selectedIndex"/>
      </div>
    </main>
    <main v-else class="flex-grow bg-gray-100">
      <p class="text-5xl text-center pt-10 underline">Sorry, no mails!</p>
    </main>
<!--    <p>{{mails[0]}}</p>-->
  </div>
</template>

<script>
import MailViewer from "./MailViewer";
import relativeDate from "../utils";

export default {
  name: 'home',
  components: {
    MailViewer
  },
  data() {
    return {
      selectedIndex: 0,
      selectedMail: this.$store.state.mails[0]
    };
  },
  computed: {
    mails() {
      return this.$store.state.mails
    }
  },
  methods: {
    selectMail: function(index) {
      this.selectedMail = this.$store.state.mails[index]
      this.selectedIndex = index
    },
    relativeDate: (date) => {
      return relativeDate(date)
    },
    classObject: function (index) {
      return {
        'border-b': index < this.mails.length -1,
        'bg-gray-200': index === this.selectedIndex
      }
    },
    onEnter: function(e) {
      this.$store.commit('setHost', {
        newHost: e.target.value
      });
    }
  },
  mounted() {}
}
</script>
