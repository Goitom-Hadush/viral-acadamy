<?php

namespace Tests;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    // Every test runs against a freshly migrated in-memory database
    // (the app reads settings tables such as payment_settings on every page).
    use RefreshDatabase;
}
