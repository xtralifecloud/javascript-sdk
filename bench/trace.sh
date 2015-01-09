dtrace -n 'profile-97/pid == 89850 && arg1/{
    @[jstack(100, 8000)] = count(); } tick-60s { exit(0); }' > stacks.out