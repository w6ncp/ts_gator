import {
  type CommandsRegistry,
  registerCommand,
  runCommand,
} from "./commands/commands";
import { handlerAgg } from "./commands/aggregate";
import { handlerReset } from "./commands/reset";
import { handlerAddFeed } from "./commands/feeds";
import { handlerFollowFeed, handlerListFeeds, handlerUnfollowFeed } from "./commands/feedFollows";
import { handlerLogin, handlerRetister, handlerUsers } from "./commands/users";
import { handlerBrowse } from "./commands/browse";
import { middlewareLoggedIn } from "./middleware";

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.log("usage: cli <command> [args...]");
    process.exit(1);
  }

  const cmdName = args[0];
  const cmdArgs = args.slice(1);
  const commandsRegistry: CommandsRegistry = {};

  registerCommand(commandsRegistry, "register", handlerRetister);
  registerCommand(commandsRegistry, "login", handlerLogin);
  registerCommand(commandsRegistry, "reset", handlerReset);
  registerCommand(commandsRegistry, "users", handlerUsers);
  registerCommand(commandsRegistry, "agg", handlerAgg);
  registerCommand(commandsRegistry, "addfeed",
    middlewareLoggedIn(handlerAddFeed),
  );
  registerCommand(commandsRegistry, "following",
    middlewareLoggedIn(handlerListFeeds),
  );
  registerCommand(commandsRegistry, "follow",
    middlewareLoggedIn(handlerFollowFeed),
  );
  registerCommand(commandsRegistry, "unfollow",
    middlewareLoggedIn(handlerUnfollowFeed),
  );
  registerCommand(commandsRegistry, "browse",
    middlewareLoggedIn(handlerBrowse),
  );


  try {
    await runCommand(commandsRegistry, cmdName, ...cmdArgs);
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error running command ${cmdName}: ${err.message}`);
    } else {
      console.error(`Error running command ${cmdName}: ${err}`);
    }
    process.exit(1);
  }
  process.exit(0);
}

main();
