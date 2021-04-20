<template>
  <div class="home">
  <p>Wlecom to our Jack site</p>
  <p>Kindly Elon Musk left a comment on my website</p>
  <video width="400" height="400" controls>
    <source src="../assets/elon.mp4" type="video/mp4">
  </video>
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  name: 'Home',
  components: {
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cherry+Swash&display=swap');
.home {
  background-color: pink;
  background-image: url(../assets/blossom.png);
  height: 90vh;
}

video
{
 margin: 50px;
}
p
{
  font-family: 'Cherry Swash', cursive;
  color: white;
  font-size: 40px;
}


@media only screen and (max-width: 990px) {

}

@media only screen and (min-width: 991px) {


}

</style>
