// file to hold and export all components
export const Game = function (cx) {
    return (
      <div class="game-tilt" onclick={this.click} onpointerup={this.pointerup} onpointercancel={this.pointercancel} onpointerdown={this.pointerdown}>
        <div class="game-card">
          <div class="game-image" src={this.image} alt={this.title} />
          <div class="game-text ui">{this.title}</div>
          {cx.children}
        </div>
      </div>
    );
  };