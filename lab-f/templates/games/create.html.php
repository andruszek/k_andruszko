<?php

/** @var \App\Model\Games $game */
/** @var \App\Service\Router $router */

$title = 'Create Game';
$bodyClass = "edit";

ob_start(); ?>
    <h1>Create Game</h1>
    <form action="<?= $router->generatePath('games-create') ?>" method="post" class="edit-form">
        <?php require __DIR__ . DIRECTORY_SEPARATOR . '_form.html.php'; ?>
        <input type="hidden" name="action" value="games-create">
    </form>

    <a href="<?= $router->generatePath('games-index') ?>">Back to list</a>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
