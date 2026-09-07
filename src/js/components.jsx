// file to hold and export all components
export const Game = function (cx) {
    return (
      <game-tilt onclick={this.click} onpointerup={this.pointerup} onpointercancel={this.pointercancel} onpointerdown={this.pointerdown}>
        <game-card>
          <game-image src={this.image} alt={this.title} />
          <game-text class="ui">{this.title}</game-text>
          {cx.children}
        </game-card>
      </game-tilt>
    );
  };