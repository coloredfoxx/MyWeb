<?php

/**
 * ownCloud - Activity App
 *
 * @author Frank Karlitschek
 * @copyright 2013 Frank Karlitschek frank@owncloud.org
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU AFFERO GENERAL PUBLIC LICENSE
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU AFFERO GENERAL PUBLIC LICENSE for more details.
 *
 * You should have received a copy of the GNU Affero General Public
 * License along with this library.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

/** @var $l OC_L10N */
/** @var $theme OC_Defaults */
/** @var $_ array */

$lastDate = null;
foreach ($_['activity'] as $event) {
	// group by date
	// TODO: use more efficient way to group by date (don't group by localized string...)
	$currentDate = (string)(\OCP\relative_modified_date($event['timestamp'], true));

	// new date group
	if ($currentDate !== $lastDate) {
		// not first date group ?
		if ($lastDate !== null) {
?>
	</div>
</div>

<?php
		}
		$lastDate = $currentDate;
?>
<div class="section activity-section group" data-date="<?php p($currentDate) ?>">
	<h2>
		<span class="tooltip" title="<?php p(\OCP\Util::formatDate(strip_time($event['timestamp']), true)) ?>">
			<?php p(ucfirst($currentDate)) ?>
		</span>
	</h2>
	<div class="boxcontainer">
<?php
	}
	echo \OCA\Activity\Display::show($event);
}
if (!empty($_['activity'])): ?>
	</div>
</div>
<?php endif;
