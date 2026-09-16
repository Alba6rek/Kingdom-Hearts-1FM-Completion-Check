# Final Bosses — Maximum Saveable Progress

The three final-sequence entries now follow the exact same special completion
policy used by **End of the World** in World Progress.

Kingdom Hearts 1 does not create a normal persistent post-final-boss clear
save. The maximum saveable End of the World story-progress value used by the
project is:

```text
0x150F >= 0x33
```

Therefore these three entries use that state:

```text
Ansem, Seeker of Darkness
Darkside - Final
World of Chaos
```

When the save reaches the maximum persistent End of the World state, the UI
shows:

```text
Complete (max saveable progress)
```

This is deliberately a completion-tracker rule, not a claim that KH1 stores a
normal post-battle defeated flag for the final sequence.

With this special rule, all 41 boss entries now have a completion rule.

## External-link icon cleanup

The external-link marker was removed globally from `BuildExternalName()`.
Entry names remain clickable and continue to open their configured URLs in a
new tab, but no arrow is displayed after the name.
