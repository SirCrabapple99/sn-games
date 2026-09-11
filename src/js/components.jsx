// file to hold and export all components
export const Game = function (cx) {
  return (
    <div class="game-tilt" onclick={this.click} onpointerup={this.pointerup} onpointercancel={this.pointercancel} onpointerdown={this.pointerdown}>
      <div class="game-card">
        <img class="game-image" src={this.cover} alt="game image" draggable="false" />
        <div class="game-text ui">{this.title}</div>
        {cx.children}
      </div>
    </div>
  );
};