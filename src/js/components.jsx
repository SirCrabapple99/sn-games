// file to hold and export all components
export const Game = function (cx) {
    return (
      <game-tilt>
        <game-card>
          <game-image src={this.image} alt={this.title} />
          <game-text class="ui">{this.title}</game-text>
          {cx.children}
        </game-card>
      </game-tilt>
    );
  };