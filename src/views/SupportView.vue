<script setup>
import DiscordIcon from "../components/icons/IconDiscord.vue";
import RedditIcon from "../components/icons/IconReddit.vue";
import SupportIcon from "../components/icons/IconSupport.vue";
</script>
<template>
  <main class="w-full col-span-full">
    <div class="flex items-center">
      <SupportIcon class="w-9 h-9 mr-2 text-primary" />
      <h1>Support</h1>
    </div>
    <div class="box p-10">
      <div class="flex justify-around">
        <div class="box-dark">
          <div class="text-body">Get Code Wire support on our discord</div>
          <h2 class="flex justify-center items-center text-lg">
            <a class="flex items-center" href="https://discord.gg/nmg8ynKzjN">
              <DiscordIcon class="mr-2" />
              <span>Join Discord</span></a
            >
          </h2>
        </div>
        <div class="box-dark">
          <div class="text-body">Get support in our reddit sub</div>
          <h2 class="flex justify-center items-center text-lg">
            <a
              class="flex items-center"
              href="https://www.reddit.com/r/codewire/"
            >
              <RedditIcon class="mr-2" />
              <span>Code Wire</span></a
            >
          </h2>
        </div>
      </div>
    </div>
  </main>
</template>

<style></style>
